(ns metabase.sync.sync-dynamic-test
  "Tests for databases with a so-called 'dynamic' schema, i.e. one that is not hard-coded somewhere.
   A Mongo database is an example of such a DB."
  (:require
   [clojure.test :refer :all]
   [metabase.sync.core :as sync]
   [metabase.test :as mt]
   [metabase.test.mock.toucanery :as toucanery]
   [metabase.util :as u]
   [toucan2.core :as t2]))

(defn- remove-nonsense
  "Remove fields that aren't really relevant in the output for `tables` and their `fields`. Done for the sake of making
  debugging some of the tests below easier."
  [tables]
  (for [table tables]
    (-> (u/select-non-nil-keys table [:schema :name :fields])
        (update :fields (fn [fields]
                          (set
                           (for [field fields]
                             (u/select-non-nil-keys
                              field
                              [:table_id
                               :name
                               :fk_target_field_id
                               :parent_id
                               :base_type
                               :database_type
                               :database_is_auto_increment
                               :json-unfolding]))))))))

(defn- get-tables [database-or-id]
  (->> (t2/hydrate (t2/select :model/Table, :db_id (u/the-id database-or-id), {:order-by [:id]}) :fields)
       (mapv mt/boolean-ids-and-timestamps)))

(deftest sync-nested-fields-test
  (testing "basic test to make sure syncing nested fields works. This is sort of a higher-level test."
    (mt/with-temp [:model/Database db {:engine ::toucanery/toucanery}]
      (sync/sync-database! db)
      (is (= (remove-nonsense toucanery/toucanery-tables-and-fields)
             (remove-nonsense (get-tables db)))))))
