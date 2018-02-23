# twitter-tracking

Used Twitter Search API to fetch high trending tweets and store them in MongoDB store. Created various API endpoints to perform several search/sort queries on stored data.

## API Endpoints

### 1. To find high trending events with respect to some place id

### URL: /api/hightrafficevents/:placeid

**Resource Information**

|||  
|-------------|-------------|
|Response Type| `GET` |
|Response Format|`JSON`|

**Path Variables**

|   Name   | Required |                                Description                                | Default Value |       Example        |
| :------: | :------: | :-----------------------------------------------------------------------: | :-----------: | :------------------: |
| Place ID | required | Location's place id to find high trending topics in the specific location |               | 23424848 (for INDIA) |

**Example Request**

`GET /api/hightrafficevents/23424848`

---

### 2. To search for tweets with respect to search text

### URL: /api/search/:searchtext

**Resource Information**

|||  
|-------------|-------------|
|Response Type| `GET` |
|Response Format|`JSON`|

**Path Variables**

|    Name     | Required |        Description        | Default Value | Example |
| :---------: | :------: | :-----------------------: | :-----------: | :-----: |
| Search Text | required | Text to search for tweets |               |  modi   |

**Example Request**

`GET /api/search/modi`

---

### 3. To find high trending events with respect to some place id

### URL: /api/filter/:field

**Resource Information**

|||  
|-------------|-------------|
|Response Type| `GET` |
|Response Format|`JSON`|

**Path Variables**

| Name  | Required |           Description           | Default Value |                                                                                     Example                                                                                      |
| :---: | :------: | :-----------------------------: | :-----------: | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: |
| Field | required | Different possible query fields |               | text, hashtags, created_at, id_str, user_mentioned_screen_name, user_mentioned_name, text_lang, retweet_count, favorite_count, user_name, user_screen_name, user_followers_count |

**Request Parameters**

|   Name   |   Required   |                                Description                                | Default Value |                                                                                     Example                                                                                      |
| :------: | :----------: | :-----------------------------------------------------------------------: | :-----------: | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: |
| operator |   required   | operators to compare 'field' path variable with 'value' request parameter |               |                                                                               gt, gte, lt, lte, eq                                                                               |
|  value   |   required   |                              value for query                              |               |                                                                          100 (in case of retweet_count)                                                                          |
|  sortby  | not required |               different column names to sort the result by                |               | text, hashtags, created_at, id_str, user_mentioned_screen_name, user_mentioned_name, text_lang, retweet_count, favorite_count, user_name, user_screen_name, user_followers_count |
|  order   | not required |        declare for each entry in sortby as ascending or descending        |               |                                                                  1, -1 (1 for ascending and -1 for descending)                                                                   |
|  export  | not required |         different column names to include in file.csv output file         |               | text, hashtags, created_at, id_str, user_mentioned_screen_name, user_mentioned_name, text_lang, retweet_count, favorite_count, user_name, user_screen_name, user_followers_count |

**Example Request**

```
GET /api/filter/retweet_count?operator=gt&value=100&sortby%5B0%5D=user_name&sortby%5B1%5D=retweet_count&sortby%5B2%5D=text&order%5B0%5D=-1&order%5B1%5D=-1&order%5B2%5D=-1&export%5B0%5D=text&export%5B1%5D=hashtags&export%5B2%5D=created_at
```

---

### 4. To download the created file.csv

### URL: /api/download

**Resource Information**

|||  
|-------------|-------------|
|Response Type| `GET` |
|Response Format|`JSON`|

**Example Request**

`GET /api/download/`

---
