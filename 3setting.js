{
  "mappings": {
  "_doc": {
    "properties": {
      "content": {
        "type": "text",
          "analyzer": "ik_max_word",
          "search_analyzer": "ik_smart"
      }
    }
  }
}
}

{
  "query": {
  "bool": {
    "must": [
      { "match_all": { "content":   "南京"        }}
    ]
  }
}
}

{

  "settings": {
  "analysis": {
    "analyzer": {
      "ik" : {
        "tokenizer" : "ik_smart"
      }
    }
  }
}
,{
  "mappings" : {
    "content": {
      "type": "string",
        "analyzer": "ik_smart"
    }
  }
}}


let i =  {
  "settings": {
    "analysis": {
      "analyzer": {
        "ik" : {
          "tokenizer" : "ik_max_word"
        }
      }
    }
  },
  "mappings": {
    "_doc": {
      "properties": {
        "content": {
          "type": "text",
          "analyzer": "ik_max_word",
          "search_analyzer": "ik_smart"
        },
        "name": {
          "type": "text",
          "analyzer": "ik_max_word",
          "search_analyzer": "ik_smart"
        }
      }
    }
  }
}
{
  "mappings": {
  "_doc": {
    "properties": {
      "name": {
        "type": "text",
          "analyzer": "ik_max_word",
          "search_analyzer": "ik_smart"
      },
      "tag_suggest": {
        "type": "completion",
          "analyzer": "ik_max_word",
          "search_analyzer": "ik_smart",
          "payloads": false
      }
    }
  }
}
}


{
  "settings" : {
  "refresh_interval" : "5s",
    "analysis" : {
    "filter": {
      "edge_ngram_filter": {
        "type":     "edge_ngram",
          "min_gram": 1,
          "max_gram": 50
      },
      "pinyin":{
        "type" : "pinyin",
          "keep_separate_first_letter" : false,
          "keep_full_pinyin" : true,
          "keep_original" : true,
          "limit_first_letter_length" : 16,
          "lowercase" : true,
          "remove_duplicated_term" : true
      }
    },
    "tokenizer":{
      "ik_smart":{
        "type":"ik_max_word"
      }
    },
    "analyzer": {
      "ngramIndexAnalyzer": {
        "type": "custom",
          "tokenizer": "keyword",
          "filter": ["edge_ngram_filter","lowercase"]
      },
      "ngramSearchAnalyzer": {
        "type": "custom",
          "tokenizer": "keyword",
          "filter":["lowercase"]
      },
      "ikIndexAnalyzer": {
        "type": "custom",
          "tokenizer": "ik_max_word"
      },
      "ikSearchAnalyzer": {
        "type": "custom",
          "tokenizer": "ik_smart"
      },
      "pinyin":{
        "tokenizer" : "keyword",
          "filter": ["pinyin","edge_ngram_filter","lowercase"]
      }
    }
  }
},
  "mappings": {
  "_doc": {
    "properties": {
      "nickname": {
        "type": "keyword",
          "fields":{
          "words": {
            "type": "text",
              "analyzer" : "ngramIndexAnalyzer"
          },
          "PY": {
            "type": "text",
              "analyzer" : "pinyin"
          },
          "IKS": {
            "type": "text",
              "analyzer" : "ikIndexAnalyzer"
          }
        }
      }
    }
  }
}
}





{
  "settings" : {
  "refresh_interval" : "5s",
    "analysis" : {
    "filter": {
      "edge_ngram_filter": {
        "type":     "edge_ngram",
          "min_gram": 1,
          "max_gram": 50
      },
      "pinyin":{
        "type" : "pinyin",
          "keep_separate_first_letter" : false,
          "keep_full_pinyin" : true,
          "keep_original" : true,
          "limit_first_letter_length" : 16,
          "lowercase" : true,
          "remove_duplicated_term" : true
      }
    },
    "tokenizer":{
      "ik_smart":{
        "type":"ik_max_word"
      }
    },
    "analyzer": {
      "ngramIndexAnalyzer": {
        "type": "custom",
          "tokenizer": "keyword",
          "filter": ["edge_ngram_filter","lowercase"]
      },
      "ngramSearchAnalyzer": {
        "type": "custom",
          "tokenizer": "keyword",
          "filter":["lowercase"]
      },
      "ikIndexAnalyzer": {
        "type": "custom",
          "tokenizer": "ik_max_word"
      },
      "ikSearchAnalyzer": {
        "type": "custom",
          "tokenizer": "ik_smart"
      },
      "pinyin":{
        "tokenizer" : "keyword",
          "filter": ["pinyin","edge_ngram_filter","lowercase"]
      }
    }
  }
},
  "mappings": {
  "_doc": {
    "properties": {
      "nickname": {
        "type": "keyword",
          "fields":{
          "words": {
            "type": "text",
              "analyzer" : "ngramIndexAnalyzer",
              "search_analyzer": "ngramSearchAnalyzer"
          },
          "PY": {
            "type": "text",
              "analyzer" : "pinyin"
          },
          "IKS": {
            "type": "text",
              "analyzer" : "ikIndexAnalyzer",
              "search_analyzer": "ikSearchAnalyzer"
          }
        }
      }
    }
  }
}
}
