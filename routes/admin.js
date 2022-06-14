const express = require('express');
const router = express.Router();
const Projects = require('../models/projects.js');
const multer = require('multer');
const storage = multer.diskStorage({
	destination: function(req, file, cb) {
		cb(null, "projects_packs/")
	},
	filename: function(req, file, cb) {
		cb(null, file.originalname);
	}
});

const upload = multer({ storage });

router.get('/', (req, res) => {
	res.render("admin/index")
});

router.get('/contato', (req, res) => {
	res.send("Página de Contato");
});

router.get('/curriculum', (req, res) => {
	res.send("Página de Curriculum");
});

router.get('/projects', (req, res) => {
	Projects.find({}).lean().sort({ date: 'desc' }).then((projects) => {
		res.render("admin/projects", { projects: projects });
	}).catch((err) => {
		req.flash("error_msg", "Houve um erro ao listar as categorias.");
		res.redirect("/admin");
	})
});

router.get('/projects/add', (req, res) => {
	res.render("admin/addprojects");
});

router.post('/projects/new', (req, res) => {
	var errors = [];
	if (!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null) errors.push({ texto: "Nome Inválido" });
	if (!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null) errors.push({ texto: "Slug Inválido" });
	if (req.body.slug.length < 2) errors.push({ texto: "Slug com poucos caracteres" });
	if (String(req.body.nome).length < 2) errors.push({ texto: "Nome do projeto com poucos caracteres" });
	if (errors.length > 0) res.render("admin/addprojects", { errors: errors });

	new Projects({ name: req.body.nome, slug: req.body.slug }).save().then(() => req.flash("success_msg", "Projeto adicionado com sucesso.") && res.redirect('/admin/projects/fileup')).catch(err => req.flash("error_msg", "Não foi possível adicionar o projeto.") && res.redirect('/admin'));
});

router.get('/projects/fileup', (req, res) => {
	res.render('admin/addfileprojects');
});

router.post('/projects/filenew', upload.single("file"), (req, res) => {
	req.flash("success_msg", "Arquivos adicionado com sucesso!");
	res.redirect("/admin/projects");
});

router.get('/projects/edit/:id', (req, res) => {
	Projects.findOne({ _id: req.params.id }).then((projects) => {
		res.render("admin/editprojects", { name: projects.name, slug: projects.slug, id: req.params.id });
	}).catch((err) => {
		req.flash("error_msg", "Este projeto não existe.");
		res.redirect('/admin/projects');
	})
});

router.post('/projects/edit', (req, res) => {
	var errors = [];
	console.log(req.body)
	if (!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null) errors.push({ texto: "Nome Inválido" });
	if (!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null) errors.push({ texto: "Slug Inválido" });
	if (req.body.slug.length < 2) errors.push({ texto: "Slug com poucos caracteres" });
	if (req.body.nome.length < 2) errors.push({ texto: "Nome do projeto com poucos caracteres" });
	if (errors.length > 0) res.render("admin/addprojects", { errors: errors });

	Projects.findOne({ _id: req.body.id }).then((projects) => {

		projects.name = req.body.nome;
		projects.slug = req.body.slug;

		projects.save().then(() => {
			req.flash("success_msg", "Projeto editado com sucesso.");
			res.redirect("/admin/projects");
		}).catch((err) => {
			req.flash("error_msg", "Houve um erro interno ao salvar a edição da categoria.");
			res.redirect("/admin/categorias");
		})

	}).catch((err) => {
		req.flash("error_msg", "Houve um erro ao editar o projeto.");
		res.redirect("/admin/projects")
	})

})

//router.get('/projects/delete/:id', (req, res) => {

//})

module.exports = router;