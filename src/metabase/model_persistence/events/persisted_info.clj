(ns metabase.model-persistence.events.persisted-info
  (:require
   [metabase.events.core :as events]
   [metabase.model-persistence.models.persisted-info :as persisted-info]
   [metabase.model-persistence.settings :as model-persistence.settings]
   [metabase.util.log :as log]
   [methodical.core :as methodical]
   [toucan2.core :as t2]))

(derive ::event :metabase/event)
(derive :event/card-create ::event)
(derive :event/card-update ::event)

(methodical/defmethod events/publish-event! ::event
  [topic {card :object :keys [user-id] :as _event}]
  ;; try/catch here to prevent individual topic processing exceptions from bubbling up.  better to handle them here.
  (try
    ;; We only want to add a persisted-info for newly created models where dataset is being set to true.
    ;; If there is already a PersistedInfo, even in "off" or "deletable" state, we skip it as this
    ;; is only supposed to be that initial edge when the dataset is being changed.
    (when (and (= (:type card) :model)
               (model-persistence.settings/persisted-models-enabled)
               (get-in (t2/select-one :model/Database :id (:database_id card)) [:settings :persist-models-enabled])
               (nil? (t2/select-one-fn :id :model/PersistedInfo :card_id (:id card))))
      (persisted-info/turn-on-model! user-id card))
    (catch Throwable e
      (log/warnf e "Failed to process persisted-info event. %s" topic))))
