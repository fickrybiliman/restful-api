var express = require('express');
var router = express.Router();
const models = require('../models');

//middlewares for check express-session
const { checkAuthSession } = require('../middlewares/auth');

router.get('/', checkAuthSession, function(req, res, next) {
   models.Konstituen.findAll({include: [{model: models.Kecamatan}, {model: models.Kelurahan}]}).then(konstituens => {
      // console.log(konstituens)
      models.Kecamatan.findAll().then(kecamatans => {
         models.Kelurahan.findAll().then(kelurahans => {
            res.render('konstituen/index', {konstituen: konstituens, kecamatan: kecamatans, kelurahan: kelurahans});
         })
      })
   }).catch(err => {
      console.log(err);
      res.render('konstituen/index');
   })
});

router.get('/viewPerKecamatan/:id', (req, res, next) => {
   const kecamatanId = req.params.id;
   models.Konstituen.findAll({
      include: [{model: models.Kecamatan}, 
                {model: models.Kelurahan}],
      where: {kecamatanID: kecamatanId}
   }).then(konstituens => {
      // console.log(konstituens)
      models.Kecamatan.findAll().then(kecamatans => {
         // console.log(kecamatans)
         models.Kecamatan.findOne({where: {id: kecamatanId}}).then(namaKecamatan => {
            models.Kelurahan.findAll().then(kelurahans => {
               res.render('konstituen/viewPerKecamatan', {konstituen: konstituens, kecamatan: kecamatans, namaKecamatan: namaKecamatan, kelurahan: kelurahans});
            })
         })
      })
   }).catch(err => {
      console.log(err);
      res.render('konstituen/index');
   })
});

router.get('/viewPerKelurahan/:id', (req, res, next) => {
   const kelurahanId = req.params.id;
   models.Konstituen.findAll({
      include: [{model: models.Kecamatan}, 
                {model: models.Kelurahan}],
      where: {kelurahanID: kelurahanId}
   }).then(konstituens => {
      // console.log(konstituens)
      models.Kelurahan.findAll().then(kelurahans => {
         // console.log(kecamatans)
         models.Kelurahan.findOne({where: {id: kelurahanId}}).then(namaKelurahan => {
            models.Kecamatan.findAll().then(kecamatans => {
               res.render('konstituen/viewPerKelurahan', {konstituen: konstituens, kelurahan: kelurahans, namaKelurahan: namaKelurahan, kecamatan: kecamatans});
            })
         })
      })
   }).catch(err => {
      console.log(err);
      res.render('konstituen/index');
   })
});

router.get('/add', checkAuthSession, (req, res, next) => {
   models.Kecamatan.findAll().then(kecamatans => {
      // console.log(kecamatans)
      models.Kelurahan.findAll().then(kelurahans => {
         res.render('konstituen/add', {kecamatan: kecamatans, kelurahan: kelurahans});
      }) 
   }).catch(err => {
      console.log(err);
      res.render('konstituen/add');
   })
});

router.post('/add', checkAuthSession, (req, res, next) => {
   const {nama, nik, hp, alamat, kecamatanID, kelurahanID, tps} = req.body;
   models.Konstituen.create({nama, nik, hp, alamat, kecamatanID, kelurahanID, tps}).then(konstituen => {
      res.redirect('/konstituens');
   }).catch(err => {
      console.log(err);
      res.redirect('/konstituens');
   })
});

router.get('/edit/:id', checkAuthSession, (req, res, next) => {
   const konstituenId = req.params.id;
   models.Kecamatan.findAll().then(kecamatans => {
      models.Kelurahan.findAll().then(kelurahans => {
         models.Konstituen.findOne({where: {id: konstituenId}}).then(konstituen => { 
            // console.log(kelurahans)
            res.render('konstituen/edit', {konstituen: konstituen, kecamatan: kecamatans, kelurahan: kelurahans});
         })
      })
   }).catch(err => {
      console.log(err);
      res.redirect('/konstituens');
   })
});

router.post('/edit/:id', (req, res, next) => {
   const konstituenId = req.params.id;
   const {nama, nik, hp, alamat, kecamatanID, kelurahanID, tps} = req.body;
   models.Konstituen.findOne({where: {id: konstituenId}}).then(konstituen => {
      return konstituen.update({
         nama,
         nik,
         hp,
         alamat,
         kecamatanID,
         kelurahanID,
         tps
      })
   }).then(updatedKonstituen => {
      res.redirect('/konstituens');
   }).catch(err => {
      console.log(err);
      res.redirect('/konstituens');
   })
});

router.get('/delete/:id', checkAuthSession, (req, res, next) => {
   const konstituenId = req.params.id;
   models.Konstituen.findOne({where: {id: konstituenId}}).then(konstituen => {
      return konstituen.destroy();
   }).then(konstituen => {
      res.redirect('/konstituens');
   }).catch(err => {
      console.log(err);
      res.redirect('/konstituens');
   })
});

module.exports = router;