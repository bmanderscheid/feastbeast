/**
 * Created by manderscheid on 8/20/16.
 */

(function () {

    var fb = fb || {};

    fb.init = function () {
        var user;
        var me = this;
        var config = {
            apiKey: "AIzaSyCsGWvM0qTGzqzj24hkn2xFZqqVKrUqVMI",
            authDomain: "feast-beast-1001.firebaseapp.com",
            databaseURL: "https://feast-beast-1001.firebaseio.com",
            storageBucket: "feast-beast-1001.appspot.com"
        };
        firebase.initializeApp(config);

        //user in?
        firebase.auth().onAuthStateChanged(function (user) {
            if (user) {
                location = "categories.html";
            }
            else {
                document.getElementById("signInBtn").addEventListener("click",function(){
                    me.signInWithRedirect();
                });
            }
        });
    };

    fb.signInWithRedirect = function(){
        var provider = new firebase.auth.GoogleAuthProvider();
        firebase.auth().signInWithRedirect(provider);
    };


    window.fb = fb;

}());

(function () {

    var cats = cats || {};

    cats.init = function () {
        var user;
        var me = this;
        var config = {
            apiKey: "AIzaSyCsGWvM0qTGzqzj24hkn2xFZqqVKrUqVMI",
            authDomain: "feast-beast-1001.firebaseapp.com",
            databaseURL: "https://feast-beast-1001.firebaseio.com",
            storageBucket: "feast-beast-1001.appspot.com"
        };
        firebase.initializeApp(config);

        //user in?
        firebase.auth().onAuthStateChanged(function (user) {
            if (user) {
                me.getFoodCats();
            }
            else {
                document.getElementById("signInBtn").addEventListener("click",function(){
                    me.signInWithRedirect();
                });
            }
        });
    };

    cats.getFoodCats = function(){
        var cats = firebase.database().ref("foodCategories/");
        cats.on("value", function(snapshot){
            console.log(snapshot.val());
        })
    };

    window.cats = cats;

}());
