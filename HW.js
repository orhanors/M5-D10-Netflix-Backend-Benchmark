/*
    Portfolio Challenge: Netflix

    You are creating the API for your Netfix App

    Each Media in you App has these info:

    {
        "Title": "The Lord of the Rings: The Fellowship of the Ring",
        "Year": "2001",
        "imdbID": "tt0120737",  //UNIQUE
        "Type": "movie",
        "Poster": "https://m.media-amazon.com/images/M/MV5BMTM5MzcwOTg4MF5BMl5BanBnXkFtZTgwOTQwMzQxMDE@._V1_SX300.jpg"
    }

    And the reviews looks like:

    {
        "_id": "123455", //SERVER GENERATED
        "comment": "A good book but definitely I don't like many parts of the plot", //REQUIRED
        "rate": 3, //REQUIRED, max 5
        "elementId": "5d318e1a8541744830bef139", //REQUIRED = IMDBID
        "createdAt": "2019-08-01T12:46:45.895Z" // SERVER GENERATED
    }


    //BACKEND

    You are in charge of building the Backend using NodeJS + Express. 
    The backend should include the extra following features:

    CRUD for Media ( /media GET, POST, DELETE, PUT)
    CRUD for Reviews ( /reviews GET, POST, DELETE, PUT) (alternatively you could decide to embed reviews in medias...)
    Handle media's image upload (POST /media/{id}/upload)
    Get all the reviews of a specific media (GET /media/{id}/reviews)
    [EXTRA] GET /media/:id should fetch the information from omdbapi for that specific media
    [EXTRA] GET /media/catalogue?title=whatever should return a PDF containing all the movies containing the given word in the title
    [EXTRA] GET /media?title=book => should return media with title containing "book" (must be possible to filter also for year and type)
    [EXTRA] GET /media should return the movies sorted by the Avg Rate value
    [EXTRA] POST /media/sendCatalogue should send and email with the catalogue that match the title to the given address in the req.body: 
            { title=whatever,email=my@email.com}
    [EXTRA] GET /media/search ⇒ given a title in the query search in omdb catalogue by title

    //FRONTEND

    Connect this app to your Netflix App.
    The user should be able to surf movies (remember you have to use http://www.omdbapi.com/ to get details when the user enters a movie)

    //DEPLOY

    Both client and server App should be deployed on your Heroku account.*/
