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
        "type":"ik_smart"
      },
      "ik_max_word": {
        "type": "ik_max_word"
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
