# calendar front-end

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev
```

# How to

First of all, notice navigation on your left.  

You can choose in what form use it (weeks / months / years)  

In week mode, you can add plans by tapping on free cell, update or remove already created plans.  

In month mode, you can go to week mode by tapping on some week, in top left corner of day, you can see number of plans, which you created for this day, also you can see list of all planned events for this month by tapping on 'list' icon near month name  

In year mode functionality is similar to month mode   

You can run application offline after first launch, but VERY important firstly launch root route of app (like http://localhost:8080 for dev mode) !!!   

Data of events is stored in Local Storage of your browser, and offline working provided by cache
