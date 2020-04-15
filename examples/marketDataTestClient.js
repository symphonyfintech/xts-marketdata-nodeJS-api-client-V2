//Accessing the XtsMarketDataAPI and XtsMarketDataWS from xts-marketdata-api library

var XtsMarketDataAPI = require('xts-marketdata-api').xtsMarketDataAPI;
var XtsMarketDataWS = require('xts-marketdata-api').WS;

var config = require('./config/config.json');

let secretKey = config.secretKey;
let appKey = config.appKey;
let source = config.source;
let url = config.url;


//xtsInteractive for API calls and xtsMarketDataWS for events related functionality
var xtsMarketDataAPI = null;
var xtsMarketDataWS = null;

(async () => {

    //creating the instance of XTSRest
    xtsMarketDataAPI = new XtsMarketDataAPI(url);

    //calling the logIn API
    var loginRequest = {
        secretKey,
        appKey,
        source
    }

    let logIn = await xtsMarketDataAPI.logIn(loginRequest);

    // checking for valid loginRequest
    if (logIn && logIn.type == xtsMarketDataAPI.responseTypes.success) {

        //creating the instance of xtsMarketDataWS
        xtsMarketDataWS = new XtsMarketDataWS(url);

        //Instantiating the socket instance
        var socketInitRequest = {
            userID,
            publishFormat,
            broadcastMode,
            token: logIn.result.token   // Token Generated after successful LogIn
        }
        xtsMarketDataWS.init(socketInitRequest);

        //Registering the socket Events
        await registerEvents();

        //calling the remaining methods of the Interactive API
        testAPI();

    } else {
        //In case of failure
        console.error(logIn);
    }
})();





async function testAPI() {

    // get enums of application 
    await clientConfig();

    let searchInstrumentRequest = {
        searchString: "REL",
        source: source
    }

    // search instrument using 3 letter string 
    await searchInstrument(searchInstrumentRequest);

    let searchInstrumentByIdRequest = {
        source: source,
        isTradeSymbol: isTradeSymbol,
        instruments: [
            { exchangeSegment: xtsMarketDataAPI.exchangeSegments.NSECM, exchangeInstrumentID: "3045" }
        ]
    }

    // search instrument by ID
    await searchInstrumentById(searchInstrumentByIdRequest);

    // Additional Instrument/contract masters in a single structure
    // This call can be made once in a day and the response can be persisted in local storage or file as per you application design and you can fetch instrumented or Symbols from this dataset throughout the day
    let instrumentMasterRequest = {
        exchangeSegmentList: [
            xtsMarketDataAPI.exchangeSegments.NSECM
        ],
    }

    await instrumentMaster(instrumentMasterRequest);


    let instrumentByISINRequest = {
        source: source,
        userID: userID,
        ISINLIST: [
            
        ]
    }
   // search instrument by isin 
    await instrumentByISIN(instrumentByISINRequest);
   
    let getQuotesRequest = {
        isTradeSymbol: isTradeSymbol,
            instruments: [
            {
                exchangeSegment: xtsMarketDataAPI.exchangeSegments.NSECM,
                exchangeInstrumentID: 2885
            },
            {
                exchangeSegment: xtsMarketDataAPI.exchangeSegments.NSECM,
                exchangeInstrumentID: 11536
            }
        ],
        xtsMessageCode: xtsMarketDataAPI.marketDataPorts.marketDepthEvent,
        publishFormat: "JSON"
    }

    // get details of instrument 
    await getQuotes(getQuotesRequest);

    let subscriptionRequest = {
        isTradeSymbol: isTradeSymbol,
        instruments: [
            {
                exchangeSegment: xtsMarketDataAPI.exchangeSegments.NSECM,
                exchangeInstrumentID: 22
            },
            {
                exchangeSegment: xtsMarketDataAPI.exchangeSegments.NSECM,
                exchangeInstrumentID: 11536
            }
        ],
        marketDataPort: xtsMarketDataAPI.marketDataPorts.marketDepthEvent
    }

    // subscribe instrument to get market data 
    await subscription(subscriptionRequest);


    let unSubscriptionRequest = {
        isTradeSymbol: isTradeSymbol,
        instruments: [
            {
                exchangeSegment: xtsMarketDataAPI.exchangeSegments.NSECM,
                exchangeInstrumentID: 2885
            },
            {
                exchangeSegment: xtsMarketDataAPI.exchangeSegments.NSECM,
                exchangeInstrumentID: 11536
            }
        ],
        marketDataPort: xtsMarketDataAPI.marketDataPorts.marketDepthEvent
    }

    // unsubscibe instrument 
    await unSubscription(unSubscriptionRequest);

     let getOHLCRequest = {
        exchangeSegment: xtsMarketDataAPI.exchangeSegments.NSECM,
        exchangeInstrumentID: 11536,
        startTime: "1581663304",
        endTime: "1581669000",
        compressionValue :60
    }

    // get OHLC data 
    await getOHLC(getOHLCRequest);

    let getSubscriptionListRequest = {
        xtsMessageCode: xtsMarketDataAPI.marketDataPorts.marketDepthEvent
    }
    
    // to get subscription list of instruments 
    await getSubscriptionlist(getSubscriptionListRequest);

    let getIndexListRequest = {
        exchangeSegment: xtsMarketDataAPI.exchangeSegments.NSECM
    }

    // to get index list 
    await getIndexList(getIndexListRequest);
    
    // logout
    await logOut();

}

var subscription = async function (subscriptionRequest) {

    let response = await xtsMarketDataAPI.subscription(subscriptionRequest);
    console.log(response);
    return response;

}

var unSubscription = async function (unSubscriptionRequest) {

    let response = await xtsMarketDataAPI.unSubscription(unSubscriptionRequest);
    console.log(response);
    return response;

}

var getQuotes = async function (getQuotesRequest) {

    let response = await xtsMarketDataAPI.getQuotes(getQuotesRequest);
    console.log(response);
    return response;

}

var searchInstrumentById = async function (searchInstrumentByIdRequest) {

    let response = await xtsMarketDataAPI.searchInstrumentById(searchInstrumentByIdRequest);
    console.log(response);
    return response;

}

var searchInstrument = async function (searchInstrumentRequest) {

    let response = await xtsMarketDataAPI.searchInstrument(searchInstrumentRequest);
    console.log(response);
    return response;

}

var clientConfig = async function (clientConfigRequest) {

    let response = await xtsMarketDataAPI.clientConfig(clientConfigRequest);
    console.log(response);
    return response;

}

var logOut = async function () {

    let response = await xtsMarketDataAPI.logOut();
    console.log(response);
    return response;

}


var registerEvents = async function () {


    //instantiating the listeners for all event related data

    //"connect" event listener
    xtsMarketDataWS.onConnect((connectData) => {

        console.log(connectData);

    });

    //"joined" event listener
    xtsMarketDataWS.onJoined((joinedData) => {

        console.log(joinedData);

    });

    //"error" event listener
    xtsMarketDataWS.onError((errorData) => {

        console.log(errorData);

    });

    //"disconnect" event listener
    xtsMarketDataWS.onDisconnect((disconnectData) => {

        console.log(disconnectData);

    });

    //"marketDepthEvent" event listener
    xtsMarketDataWS.onMarketDepthEvent((marketDepthData) => {

        console.log(marketDepthData);

    });

    //"openInterestEvent" event listener
    xtsMarketDataWS.onOpenInterestEvent((openInterestData) => {

        console.log(openInterestData);

    });

    //"indexDataEvent" event listener
    xtsMarketDataWS.onIndexDataEvent((indexData) => {

        console.log(indexData);

    });

    //"marketDepth100Event" event listener
    xtsMarketDataWS.onMarketDepth100Event((marketDepth100Data) => {

        console.log(marketDepth100Data);

    });

    //"candleDataEvent" event listener
    xtsMarketDataWS.onCandleDataEvent((candleData) => {

        console.log(candleData);

    });

    // //"logout" event listener
    xtsMarketDataWS.onLogout((logoutData) => {

        console.log(logoutData);

    });
}