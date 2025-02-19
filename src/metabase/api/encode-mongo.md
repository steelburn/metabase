Request
```
POST http://localhost:3000/api/dataset/native'

{
    "database": 369,
    "type": "query",
    "query": {
        "source-table": 714,
        "filter": [
            "and",
            [
                "=",
                [
                    "field",
                    3075,
                    {
                        "base-type": "type/MongoBSONID"
                    }
                ],
                "67b5f89e5106d21e3cfc0421"
            ],
            [
                "=",
                [
                    "field",
                    12122,
                    {
                        "base-type": "type/*"
                    }
                ],
                "64499694-4ac1-487b-98f5-ef6b351f3477"
            ]
        ]
    }
}
```

<details>
    <summary>Response</summary>

```
{
  "projections": [
    "_id",
    "id",
    "uuid"
  ],
  "query": [
    {
      "$match": {
        "$and": [
          {
            "_id": "67b5f89e5106d21e3cfc0421"
          },
          {
            "uuid": "org.bson.types.Binary@de4fced0"
          }
        ]
      }
    },
    {
      "$project": {
        "_id": "$_id",
        "id": "$id",
        "uuid": "$uuid"
      }
    },
    {
      "$limit": 1048575
    }
  ],
  "collection": "uuidcoll",
  "mbql?": true,
  "native-query": "[\n    {\n        \"$match\": {\n            \"$and\": [\n                {\n                    \"_id\": ObjectId('67b5f89e5106d21e3cfc0421')\n                },\n                {\n                    \"uuid\": UUID('64499694-4ac1-487b-98f5-ef6b351f3477')\n                }\n            ]\n        }\n    },\n    {\n        \"$project\": {\n            \"_id\": \"$_id\",\n            \"id\": \"$id\",\n            \"uuid\": \"$uuid\"\n        }\n    },\n    {\n        \"$limit\": 1048575\n    }\n]"
}
```
<details>

Note the new `"native-query"` field, which when unescaped is a query you can run directly on Mongo:

```
[
    {
        "$match": {
            "$and": [
                {
                    "_id": ObjectId('67b5f89e5106d21e3cfc0421')
                },
                {
                    "uuid": UUID('64499694-4ac1-487b-98f5-ef6b351f3477')
                }
            ]
        }
    },
    {
        "$project": {
            "_id": "$_id",
            "id": "$id",
            "uuid": "$uuid"
        }
    },
    {
        "$limit": 1048575
    }
]
```

