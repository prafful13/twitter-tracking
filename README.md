# twitter-tracking

Used Twitter Search API to fetch high trending tweets and store them in MongoDB store. Created various API endpoints to perform several search/sort queries on stored data.

Project is live at: https://mysterious-tor-32167.herokuapp.com/api/hightrafficevents/23424848

## API Endpoints

### 1. To find high trending events with respect to some place id

### URL: /api/hightrafficevents/:placeid

**Resource Information**

|                 |        |
| --------------- | ------ |
| Request Method  | `GET`  |
| Response Format | `JSON` |

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

|                 |        |
| --------------- | ------ |
| Request Method  | `GET`  |
| Response Format | `JSON` |

**Path Variables**

|    Name     | Required |        Description        | Default Value | Example |
| :---------: | :------: | :-----------------------: | :-----------: | :-----: |
| Search Text | required | Text to search for tweets |               |  modi   |

**Example Request**

`GET /api/search/modi`

---

### 3. Filter tweets based on various operations as defined below

### URL: /api/filter/:field

**Resource Information**

|                 |        |
| --------------- | ------ |
| Request Method  | `GET`  |
| Response Format | `JSON` |

**Path Variables**

| Name  | Required |           Description           | Default Value |                                                                                     Example                                                                                      |
| :---: | :------: | :-----------------------------: | :-----------: | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: |
| Field | required | Different possible query fields |               | text, hashtags, created_at, id_str, user_mentioned_screen_name, user_mentioned_name, text_lang, retweet_count, favorite_count, user_name, user_screen_name, user_followers_count |

**Request Parameters**

|   Name   |   Required   |                                Description                                |     Default Value      |                                                                                     Example                                                                                      |
| :------: | :----------: | :-----------------------------------------------------------------------: | :--------------------: | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: |
| operator |   required   | operators to compare 'field' path variable with 'value' request parameter |                        |                                                             gt, gte, lt, lte, eq, startswith, endswith, contains, is                                                             |
|  value   |   required   |                              value for query                              |                        |                                                                          100 (in case of retweet_count)                                                                          |
|  sortby  | not required |               different column names to sort the result by                |                        | text, hashtags, created_at, id_str, user_mentioned_screen_name, user_mentioned_name, text_lang, retweet_count, favorite_count, user_name, user_screen_name, user_followers_count |
|  order   | not required |        declare for each entry in sortby as ascending or descending        |                        |                                                                  1, -1 (1 for ascending and -1 for descending)                                                                   |
|  export  | not required |         different column names to include in file.csv output file         |                        | text, hashtags, created_at, id_str, user_mentioned_screen_name, user_mentioned_name, text_lang, retweet_count, favorite_count, user_name, user_screen_name, user_followers_count |
|   pgno   | not required |                        Page no. of required result                        |                        |                                                                                        1                                                                                         |
|  limit   | not required |                   maximum number of results on one page                   | 100 OR maximum results |                                                                                        10                                                                                        |

**Example Request**

```
GET /api/filter/retweet_count?operator=gt&value=100&sortby%5B0%5D=user_name&sortby%5B1%5D=retweet_count&sortby%5B2%5D=text&order%5B0%5D=-1&order%5B1%5D=-1&order%5B2%5D=-1&export%5B0%5D=text&export%5B1%5D=hashtags&export%5B2%5D=created_at
```

---

### 4. To download the created file.csv

### URL: /api/download

**Resource Information**

|                 |        |
| --------------- | ------ |
| Request Method  | `GET`  |
| Response Format | `JSON` |

**Example Request**

`GET /api/download/`

---

## Some sample api requests and their screenshots

### URL:

```
https://mysterious-tor-32167.herokuapp.com/api/search/Papon
```

### To search for tweets with keyword Papon

![alt text](/screenshots/search.png)

### URL:

```
https://mysterious-tor-32167.herokuapp.com/api/hightrafficevents/23424848
```

### To search for high traffic events

![alt text](/screenshots/hightrafficevents.png)

### URL:

```
https://mysterious-tor-32167.herokuapp.com/api/filter/retweet_count?operator=lte&value=200&sortby%5B0%5D=retweet_count&order%5B0%5D=-1
```

### To search for tweets in db with retweet_count <= 200 and sort them in descending order of the count

![alt text](/screenshots/filterbyretweetcount.png)

### URL:

```
https://mysterious-tor-32167.herokuapp.com/api/filter/text?operator=startswith&value=R&sortby%5B0%5D=user_name&sortby%5B1%5D=retweet_count&order%5B0%5D=-1&order%5B1%5D=-1&export%5B0%5D=user_name&export%5B1%5D=text&export%5B2%5D=hashtags&pgno=0&limit=5
```

### To search for tweets in db text field starting with value R and sort the result by user_name and retweet_count (both descending). It also saves result in csv format which can be downloaded from /api/download endpoint.

![alt text](/screenshots/filterbytextsearch.png)
