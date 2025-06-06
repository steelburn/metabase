(ns metabase.util.malli.schema-test
  (:require
   [clojure.test :refer :all]
   [metabase.util.malli.registry :as mr]
   [metabase.util.malli.schema :as ms]))

(deftest ^:parallel schema-test
  (doseq [{:keys [schema failed-cases success-cases]}
          [{:schema        ms/NonBlankString
            :failed-cases  ["" 1]
            :success-cases ["a thing"]}
           {:schema        ms/IntGreaterThanOrEqualToZero
            :failed-cases  ["1" -1 1.5]
            :success-cases [0 1]}
           {:schema        ms/PositiveInt
            :failed-cases  ["1" 0 1.5]
            :success-cases [1 2]}
           {:schema        ms/KeywordOrString
            :failed-cases  [1 [1] {:a 1}]
            :success-cases [:a "a"]}
           {:schema        ms/FieldType
            :failed-cases  [:type/invalid :Semantic/*]
            :success-cases [:type/Float]}
           {:schema        ms/FieldSemanticOrRelationType
            :failed-cases  [:Relation/invalid :type/Float]
            :success-cases [:type/FK :type/Category]}
           {:schema        ms/CoercionStrategy
            :failed-cases  [:type/Category :type/Float]
            :success-cases [:Coercion/ISO8601->Date]}
           {:schema        ms/FieldTypeKeywordOrString
            :failed-cases  [1 :type/FK]
            :success-cases [:type/Float "type/Float"]}
           {:schema        ms/Map
            :failed-cases  [[] 1 "a"]
            :success-cases [{} {:a :b}]}
           {:schema        ms/Email
            :failed-cases  ["abc.com" 1]
            :success-cases ["ngoc@metabase.com"]}
           {:schema        ms/ValidPassword
            :failed-cases  ["abc.com" 1 "PASSW0RD"]
            :success-cases ["unc0mmonpw"]}
           {:schema        ms/TemporalString
            :failed-cases  ["random string"]
            :success-cases ["2019-10-28T13:14:15" "2019-10-28"]}
           {:schema        ms/JSONString
            :failed-cases  ["string"]
            :success-cases ["{\"a\": 1}"]}
           {:schema        ms/EmbeddingParams
            :failed-cases  [{:key "value"}]
            :success-cases [{:key "disabled"}]}
           {:schema        ms/ValidLocale
            :failed-cases  ["locale"]
            :success-cases ["en" "es"]}
           {:schema        ms/NanoIdString
            :failed-cases  ["random"]
            :success-cases ["FReCLx5hSWTBU7kjCWfuu"]}
           {:schema        ms/UUIDString
            :failed-cases  ["aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"]
            :success-cases ["84a51d43-2d29-4c2c-8484-e51eb5af2ca4"]}]]
    (testing (format "schema %s" (pr-str schema))
      (doseq [case failed-cases]
        (testing (format "case: %s should fail" (pr-str case))
          (is (false? (mr/validate schema case)))))

      (doseq [case success-cases]
        (testing (format "case: %s should success" (pr-str case))
          (is (true? (mr/validate schema case))))))))
