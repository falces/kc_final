'use strict';

module.exports = function(){
    return function(req, res, next){
        if(!req.session.authUser){
            res.redirect('login');
            return;
        }
        // rol
        /*
        const usuario = await Usuario.findById(req.session.authUser._id);
        if(!usuario.hasRole(roleToCheck)){
            res.redirect('login');
            return;
        }
        */  
        next();
    }
}