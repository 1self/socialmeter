if (Meteor.isClient) {
    var config = {
        appId: "app-id-778201fd16ec17dd8b15ee7982d22ede",
        appSecret: "app-secret-853142e32c77fa16bf898c5738d5f236b36cb094c66966e5f88ac3ba0a2e7f7a",
        "appName": "co.1self.mood-o-meter",
        "appVersion": "0.0.1"
    };

    var lib1self = new Lib1self(config, Meteor.settings.public.env1self);

    	Meteor.startup(function () {
            var isStreamRegistered = function () {
                return window.localStorage.streamId !== undefined;
            };

            var storeStreamDetails = function (stream) {
                window.localStorage.streamId = stream.streamid;
                window.localStorage.readToken = stream.readToken;
                window.localStorage.writeToken = stream.writeToken;
            };

            if (!isStreamRegistered()) {
                console.info("registering stream.");
                lib1self.registerStream(function (stream) {
                    storeStreamDetails(stream);
                });
            }
        });

        Template.loggingPeopleMet.events({
        'click #logActivity': function () {
            var personNameInput = $("input[name='personName']");
            var moodInput = $("#moodDiv input[type='radio']:checked");
            console.log(moodInput.val());
            var moodEvent = {
                "source": config.appName,
                "version": config.appVersion,
                "objectTags": ["people"],
                "actionTags": ["interact", "met"],
                "properties": {
                    "personName": personNameInput.val(),
                    "mood": parseInt(moodInput.val())
                }
            };
            
            lib1self.sendEvent(moodEvent, window.localStorage.streamId, window.localStorage.writeToken, function(){});
            personNameInput.val("");            
            console.log("Event sent:");
            console.log(moodEvent)
        }
    });

    Template.footer.events({
        'click #displayLogActivityTemplate': function () {
            $(".logPeopleMetTemplate").show();
            $(".showVizTemplate").hide();
        },
        'click #displaySelectVizTemplate': function () {
            $(".showVizTemplate").show();
            $(".logPeopleMetTemplate").hide();
        }
    });

    Template.selectVisualizations.events({
        'click #moodStats': function () {
            var url = lib1self.visualize(window.localStorage.streamId, window.localStorage.readToken)
                .objectTags(["people"])
                .actionTags(["interact", "met"])
                .sum("mood")
                .barChart()
                .backgroundColor("84c341")
                .url();
            console.info(url);
            $(".logActivityTemplate").hide();
            window.open(url, "_system", "location=no");
        }
    });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
