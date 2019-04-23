{
  "settings" : {
  "refresh_interval" : "5s",
    "analysis": {
    "filter": {
      "pinyin_simple_filter": {
        "lowercase": "true",
          "keep_original": "false",
          "keep_first_letter": "true",
          "keep_separate_first_letter": "false",
          "type": "pinyin",
          "limit_first_letter_length": "50",
          "keep_full_pinyin": "false"
      },
      "pinyin_full_filter": {
        "keep_joined_full_pinyin": "true",
          "lowercase": "true",
          "none_chinese_pinyin_tokenize": "true",
          "keep_original": "false",
          "keep_first_letter": "false",
          "keep_separate_first_letter": "false",
          "type": "pinyin",
          "limit_first_letter_length": "50",
          "keep_full_pinyin": "true"
      },
      "edge_ngram_filter": {
        "type": "edge_ngram",
          "min_gram": "1",
          "max_gram": "50"
      }
    },
    "analyzer": {
      "standard": {
        "type": "custom",
          "tokenizer": "standard"
      },
      "pinyiFullIndexAnalyzer": {
        "filter": [
          "pinyin_full_filter"
          ,
          "lowercase"
        ],
          "tokenizer": "keyword"
      },
      "pinyiSimpleIndexAnalyzer": {
        "filter": [
          "pinyin_simple_filter"
          ,
          "edge_ngram_filter"
          ,
          "lowercase"
        ],
          "tokenizer": "keyword"
      },
      "pinyiFullSearchAnalyzer": {
        "filter": [
          "pinyin_full_filter"
          ,
          "lowercase"
        ],
          "tokenizer": "keyword"
      },
      "ikIndexAnalyzer": {
        "type": "custom",
          "tokenizer": "ik_max_word"
      },
      "ikSearchAnalyzer": {
        "type": "custom",
          "tokenizer": "ik_smart"
      },
      "ngramIndexAnalyzer": {
        "filter": [
          "edge_ngram_filter"
          ,
          "lowercase"
        ],
          "type": "custom",
          "tokenizer": "keyword"
      },
      "ngramSearchAnalyzer": {
        "filter": [
          "lowercase"
        ],
          "type": "custom",
          "tokenizer": "keyword"
      },
      "pinyiSimpleSearchAnalyzer": {
        "filter": [
          "pinyin_simple_filter"
          ,
          "lowercase"
        ],
          "tokenizer": "keyword"
      }
    },
    "tokenizer": {
      "ik_smart": {
        "type": "ik_smart"
      },
      "ik_max_word": {
        "type": "ik_max_word"
      }
    }
  }
},
  "mappings": {
  "_doc": {
    "properties": {
      "name": {
        "type": "keyword",
          "fields": {
          "IKS": {
            "search_analyzer": "ikSearchAnalyzer",
              "analyzer": "ikIndexAnalyzer",
              "type": "text"
          },
          "words": {
            "search_analyzer": "ngramSearchAnalyzer",
              "analyzer": "ngramIndexAnalyzer",
              "type": "text"
          },
          "EN": {
            "analyzer": "standard",
              "type": "text"
          },
          "SPY": {
            "analyzer": "pinyiSimpleIndexAnalyzer",
              "type": "text"
          },
          "FPY": {
            "analyzer": "pinyiFullIndexAnalyzer",
              "type": "text"
          }
        }
      },
      "content": {
        "type": "keyword",
          "fields": {
          "IKS": {
            "search_analyzer": "ikSearchAnalyzer",
              "analyzer": "ikIndexAnalyzer",
              "type": "text"
          }
        }
      }
    }
  }
}
}
