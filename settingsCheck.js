if(Meteor.isServer){
    if(Meteor.settings === undefined){
        throw new Meteor.Error("pass production.settings or sandbox.settings on the command line using --setings");
    }

    if(Meteor.settings.public === undefined || Meteor.settings.public.env1self === undefined){
        throw new Meteor.Error("specify the 1self environment by adding the env1self property under public in settings file");
    }
}