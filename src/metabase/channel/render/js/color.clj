(ns metabase.channel.render.js.color
  "Namespaces that uses the Nashorn javascript engine to invoke some shared javascript code that we use to determine
  the background color of pulse table cells"
  (:require
   [clojure.java.io :as io]
   [metabase.channel.render.js.engine :as js.engine]
   [metabase.formatter.core :as formatter]
   [metabase.util.i18n :refer [trs]]
   [metabase.util.json :as json]
   [metabase.util.malli :as mu]))

(set! *warn-on-reflection* true)

(def ^:private js-file-path "frontend_shared/color_selector.js")

(def ^:private ^{:arglists '([])} js-engine
  ;; As of 2024/05/13, a single color selector js engine takes 3.5 MiB of memory
  (js.engine/threadlocal-fifo-memoizer
   (fn []
     (let [file-url (io/resource js-file-path)]
       (assert file-url (trs "Can''t find JS color selector at ''{0}''" js-file-path))
       (doto (js.engine/context)
         (js.engine/load-resource  js-file-path))))
   5))

(def ^:private QueryResults
  "This is a pretty loose schema, more as a safety net as we have a long feedback loop for this being broken as it's
  being handed to the JS color picking code. Currently it just needs column names from `:cols`, and the query results
  from `:rows`"
  [:map
   [:cols [:sequential [:map
                        [:name :string]]]]
   [:rows [:sequential [:sequential :any]]]])

(defn- convert-bignumbers-by-column
  "Convert BigDecimal and BigInteger values to doubles/longs since Graal doesn't handle these"
  [data]
  (if (empty? data)
    []
    (let [first-row (first data)
          bignum-column-indices (->> (map-indexed
                                      (fn [idx item]
                                        (when (or (instance? BigDecimal item)
                                                  (instance? BigInteger item))
                                          idx))
                                      first-row)
                                     (filter some?)
                                     (into #{}))]
      (if (empty? bignum-column-indices)
        data
        (mapv
         (fn [row]
           (vec
            (map-indexed
             (fn [idx item]
               (if (bignum-column-indices idx)
                 (cond
                   (instance? BigDecimal item)
                   (.doubleValue ^BigDecimal item)

                   (instance? BigInteger item)
                   (.longValue ^BigInteger item)

                   :else item)
                 item))
             row)))
         data)))))

(mu/defn make-color-selector
  "Returns a curried javascript function (object) that can be used with `get-background-color` for delegating to JS
  code to pick out the correct color for a given cell in a pulse table. The logic for picking a color is somewhat
  complex, but defined in a set of rules in `viz-settings`. There are some colors that are picked based on a
  particular cell value, others affect the row, so it's necessary to call this once for the resultset and then
  `get-background-color` on each cell."
  [{:keys [cols rows]} :- QueryResults
   viz-settings]
  ;; Ideally we'd convert everything to JS data before invoking the function below, but converting rows would be
  ;; expensive. The JS code is written to deal with `rows` in it's native Nashorn format but since `cols` and
  ;; `viz-settings` are small, pass those as JSON so that they can be deserialized to pure JS objects once in JS
  ;; code. We do however need to handle BigDecimals as Graal won't convert these
  (let [converted-rows (convert-bignumbers-by-column rows)]
    (js.engine/execute-fn-name (js-engine) "makeCellBackgroundGetter"
                               converted-rows
                               (json/encode cols)
                               (json/encode viz-settings))))

(defn get-background-color
  "Get the correct color for a cell in a pulse table. Returns color as string suitable for use CSS, e.g. a hex string or
  `rgba()` string. This is intended to be invoked on each cell of every row in the table. See `make-color-selector`
  for more info."
  ^String [color-selector cell-value column-name row-index]
  (let [cell-value (cond
                     (formatter/NumericWrapper? cell-value)
                     (:num-value cell-value)

                     (formatter/TextWrapper? cell-value)
                     (:original-value cell-value)

                     :else
                     cell-value)]
    (.asString (js.engine/execute-fn color-selector cell-value row-index column-name))))
