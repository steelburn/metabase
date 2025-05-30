(ns metabase.events.init
  "Load event handlers that need to be loaded on system startup for side effects. Most of these namespaces should
  actually get moved to appropriate modules instead of having all tasks live here -- see
  https://www.notion.so/metabase/Backend-Modularization-2025-Plan-17669354c90180b98bd4eb9c8ccf2395.

  See https://metaboat.slack.com/archives/CKZEMT1MJ/p1736556522733279 for rationale behind this pattern."
  (:require
   [metabase.events.schema]))

;;; !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
;;; !!                                                                                                !!
;;; !!             DO NOT ADD ANY MORE EVENT HANDLER NAMESPACES UNDER `metabase.events.*`             !!
;;; !!                                                                                                !!
;;; !!   Please read https://metaboat.slack.com/archives/CKZEMT1MJ/p1738972144181069 for more info    !!
;;; !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
