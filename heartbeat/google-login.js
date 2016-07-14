   // Replace with your client ID from the developer console.
   var CLIENT_ID = '1013491944207-0qq139h021hjo0uop9s49tv2l77bef1a.apps.googleusercontent.com';
   // Set authorized scope.
   var SCOPES = ['https://www.googleapis.com/auth/analytics.readonly'];
   // Set the discovery URL.
   var DISCOVERY = 'https://analytics.googleapis.com/$discovery/rest';
   var VIEW_ID = '22895574';

   function authorize(event) {
       // Handles the authorization flow. `immediate` should be false when invoked from the button click.
       var useImmdiate = event ? false : true;
       var authData = {
           client_id: CLIENT_ID
           , scope: SCOPES
           , immediate: useImmdiate
       };
       gapi.auth.authorize(authData, function (response) {
           var authButton = document.getElementById('auth-button');
           if (response.error) {
               authButton.hidden = false;
           }
           else {
               authButton.hidden = true;
               queryReports();
           }
       });
   }

   function queryReports() {
       gapi.client.load('analytics', 'v3').then(function () {
           var goalConversions = 0;
           //Get Goal Conversions First and Save
           setInterval(function () {
               gapi.client.analytics.data.realtime.get({
                   "ids": "ga:22895574"
                   , "metrics": "rt:goalCompletionsAll"
               }).execute(function (data) {
                   goalConversions = data.result.totalsForAllResults["rt:goalCompletionsAll"];
               });
           }, 15000);
           // Get Current Active Users and update
           setTimeout(function () {
               setInterval(function () {
                   gapi.client.analytics.data.realtime.get({
                       "ids": "ga:22895574"
                       , "metrics": "rt:activeUsers"
                   }).execute(function (data) {
                       Heartbeat.getBeat(data.result.totalsForAllResults["rt:activeUsers"], goalConversions);
                   });
               }, 15000);
           }, 15000);
       });
   }
