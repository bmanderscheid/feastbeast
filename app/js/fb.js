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
                document.getElementById("signInBtn").addEventListener("click", function () {
                    me.signInWithRedirect();
                });
            }
        });
    };

    fb.signInWithRedirect = function () {
        var provider = new firebase.auth.GoogleAuthProvider();
        firebase.auth().signInWithRedirect(provider);
    };


    window.fb = fb;

}());

(function () {

    var cats = cats || {
            selectedCatId: null
        };


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
                me.setListeners();
            }
            else {
                document.getElementById("signInBtn").addEventListener("click", function () {
                    me.signInWithRedirect();
                });
            }
        });
    };

    cats.getFoodCats = function () {
        var me = this,
            cats = firebase.database().ref("foodCategories/");

        // render list
        cats.on("value", function (snapshot) {
            var foodCats = snapshot.val(),
                catsEl = document.getElementById('cats'),
                i = 0;
            $.each(foodCats, function () {
                $("#cats").append("<li class='cat' data-id='" + this.id + "'>" + this.label + "</li>");
            });

            //click
            $("li").on("click", function () {
                console.log($(this).data("id"));
                me.selectedCatId = $(this).data("id");
                me.loadVotingPage();
            });
        });
    };

    cats.loadVotingPage = function () {
        alert(this.selectedCatId);
    };

    window.cats = cats;

}());
