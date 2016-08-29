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
                location = "vote.html";
            }
            else {
                $("#signInBtn").on("click", function () {
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
            allCategories:null,
            userVotes:null,
            selectedCatId: null,
            selectedCatName:null
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
                me.setMap();
                me.setListeners();
                me.getUserVotes();
            }
            else {
                location = "index.html";
            }
        });
    };

    cats.setMap = function () {
        var me = this;
        var defaultBounds = new google.maps.LatLngBounds(
            new google.maps.LatLng(42.952763, -88.126144),
            new google.maps.LatLng(43.161977, -87.877579));

        var input = document.getElementById('searchTextField');
        var options = {
            bounds: defaultBounds,
            types: ['establishment']
        };

        autocomplete = new google.maps.places.Autocomplete(input, options);

        autocomplete.addListener('place_changed', function () {
            var place = autocomplete.getPlace();
            console.log(place);
            input.value = place.name;
            //TODO VALIDATE SELECTION
            me.makeVote(place);
        });

    };

    cats.setListeners = function () {
        $("#signOutBtn").on("click", function () {
            firebase.auth().signOut();
            location = "index.html";
        });
    };

    cats.getUserVotes = function(){
        var me = this,
            votes = firebase.database().ref("users/" + firebase.auth().currentUser.uid + "/votes/");
        votes.once("value", function (snapshot) {
            me.userVotes = snapshot.val();
            me.getFoodCats();
        });
    };

    cats.getFoodCats = function () {
        var me = this,
            cats = firebase.database().ref("foodCategories/");

        // render list
        cats.once("value", function (snapshot) {
            var foodCats = snapshot.val(),
                catsEl = document.getElementById('cats'),
                i = 0;
            $.each(foodCats, function (index) {
                $("#cats").append("<li class='cat' data-id='" + this.id + "'  data-name='" + this.label + "'>" + this.label);
                if(me.userVotes && me.userVotes[index]){
                    $("#cats").append("<span style='color:green'>- " + me.userVotes[index].placeName + "</span>");
                }
                $("#cats").append("</li>");
            });

            //click
            $("li").on("click", function () {
                me.selectedCatId = $(this).data("id");
                me.selectedCatName = $(this).data("name");
                me.loadVotingPage();
            });
        });
    };

    cats.loadVotingPage = function () {
        $("#cats").empty();
        $("#searchTextField").attr("placeholder","vote for " + this.selectedCatName);
        $("#searchTextField").show();
    };

    cats.checkVote = function (place) {
        firebase.database().ref("votes/")
    };

    cats.makeVote = function (place) {

        var voteKey = firebase.database().ref().push().key;
        var voteData = {};
        voteData["votes/" + this.selectedCatId + "/" + firebase.auth().currentUser.uid + "/"] = {
            uid: firebase.auth().currentUser.uid,
            placeId: place.place_id,
            foodCat: this.selectedCatId,
            date: new Date().getDate()
        };
        voteData["users/" + firebase.auth().currentUser.uid + "/votes/" + this.selectedCatId + "/"] = {
            placeId: place.place_id,
            placeName: place.name,
            date: new Date().getDate()
        };
        firebase.database().ref().update(voteData, this.onVoteComplete);
    };

    cats.onVoteComplete = function (error) {
        if (error) {
            alert("something went wrong")
        }
        else {
            console.log('Synchronization succeeded');
            location = "vote.html";
        }
    };


    window.cats = cats;

}());
