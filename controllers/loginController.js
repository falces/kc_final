'use strict';

const Usuario = require('../models/Usuario');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

class LoginController
{
    /**
     * GET /login
     */
    index(req, res, next)
    {
        res.locals.email = '';
        res.locals.error = '';
        res.render('login', {
            title: 'Login de usuario'
        });
	}

    /**
     * POST /login
     */
    async post(req, res, next)
    {
        try{
            // Recoger parámetros del cuerpo de la petición
            const _email = req.body.email;
            const password = req.body.password;

            // Buscar el usuario en la base de datos
			const usuario = await Usuario.findOne({email: _email});

            if(!usuario || !await bcrypt.compare(password, usuario.password)){
                res.locals.email = _email;
                res.locals.error = res.__('invalid credentials');
                res.render('login', {
                    title: 'Login de usuario'
                });
                return;
			}

            req.session.authUser = {
                _id: usuario._id,
            };

            res.redirect('/private');
        }catch(error){
            next(error);
        }
    }

    /**
     * GET /logout
     */
    logout(req, res, next)
    {
    delete req.session.authUser;
    req.session.regenerate(error => {
        if(error){
            next(error);
            return;
        }
        res.redirect('/');
    });
    }

    // Mover al API
    async loginJWT(req, res, next){
        try{
            // Recoger credenciales de la petición
            const email = req.body.email;
            const password = req.body.password;

            // Buscar el usuario en base de datos
            const usuario = await Usuario.findOne({ email: email });

            // Si no encontramos usuario le decimos que no
            if(!usuario || !await bcrypt.compare(password, usuario.password)){
                res.json({ success: false, error: res.__('Invalid credentials') });
                return;
            }

            // Si hay usuario, creamos un JWT jsonwebtoken
            const token = jwt.sign({ _id: usuario.id }, process.env.JWT_SECRET, {
                expiresIn: '2d'
            });

            // Respondemos
            res.json({ success: true, token: token });

        }catch(err){
            next(err);
        }

    }
}

module.exports = new LoginController();