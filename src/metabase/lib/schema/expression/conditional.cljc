(ns metabase.lib.schema.expression.conditional
  "Conditional expressions like `:case` and `:coalesce`."
  (:require
   [clojure.set :as set]
   [metabase.lib.schema.expression :as expression]
   [metabase.lib.schema.mbql-clause :as mbql-clause]
   [metabase.types.core :as types]))

;;; the logic for calculating the return type of a `:case` or similar statement is not optimal nor perfect. But it
;;; should be ok for now and errors on the side of being permissive. See this Slack thread for more info:
;;; https://metaboat.slack.com/archives/C04DN5VRQM6/p1678325996901389
(defn- best-return-type
  "For expressions like `:case` and `:coalesce` that can return different possible expressions, determine the best
  return type given all of the various options."
  [x y]
  (cond
    (nil? x)
    y

    ;; if the type of either x or y is unknown, then the overall type of this has to be unknown as well.
    (or (= x ::expression/type.unknown)
        (= y ::expression/type.unknown))
    ::expression/type.unknown

    ;; if both types are keywords return their most-specific ancestor.
    (and (keyword? x)
         (keyword? y))
    (types/most-specific-common-ancestor x y)

    ;; if one type is a specific type but the other is an ambiguous union of possible types, return the specific
    ;; type. A case can't possibly have multiple different return types, so if one expression has an unambiguous
    ;; type then the whole thing has to have a compatible type.
    (keyword? x)
    x

    (keyword? y)
    y

    ;; if both types are ambiguous unions of possible types then return the intersection of the two. But if the
    ;; intersection is empty, return the union of everything instead. I don't really want to go down a rabbit
    ;; hole of trying to find the intersection between the most-specific common ancestors
    :else
    (or (when-let [intersection (not-empty (set/intersection x y))]
          (if (= (count intersection) 1)
            (first intersection)
            intersection))
        (set/union x y))))

;;; believe it or not, a `:case` clause really has the syntax [:case {} [[pred1 expr1] [pred2 expr2] ...]]
;;; `:if` is an alias to `:case`
(doseq [tag [:case :if]]
  (mbql-clause/define-catn-mbql-clause tag
    ;; TODO -- we should further constrain this so all of the exprs are of the same type
    [:pred-expr-pairs [:sequential {:min 1} [:tuple
                                             {:error/message "Valid [pred expr] pair"}
                                             #_pred [:ref ::expression/boolean]
                                             #_expr [:ref ::expression/expression]]]]
    [:default [:? [:schema [:ref ::expression/expression]]]])
  (defmethod expression/type-of-method tag
    [[_tag _opts pred-expr-pairs _default]]
    ;; Following logic for picking a type is taken from
    ;; the [[metabase.query-processor.middleware.annotate/infer-expression-type]].
    (some
     (fn [[_pred expr]]
       (if-some [t (expression/type-of expr)]
         t
         ::expression/type.unknown))
     pred-expr-pairs)))

;;; TODO -- add constraint that these types have to be compatible
(mbql-clause/define-catn-mbql-clause :coalesce
  [:exprs [:repeat {:min 2} [:schema [:ref ::expression/expression]]]])

(defmethod expression/type-of-method :coalesce
  [[_tag _opts & exprs]]
  #_{:clj-kondo/ignore [:reduce-without-init]}
  (reduce best-return-type
          (map expression/type-of exprs)))
