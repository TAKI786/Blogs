var express        = require('express'),
	bodyParser     = require('body-parser'),
	mongoose       = require('mongoose'), 
	methodOverride = require('method-override'),
	app            = express();
	

// APP CONFIGURATION

mongoose.connect("mongodb://localhost/Blog_app");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));
app.set('view engine','ejs');
app.use(methodOverride('_method'));


var BlogSchema = new mongoose.Schema({
	title: String,
	image: String,
	body: String,  
	created: {type: Date, default: Date.now}
});
var Blog = mongoose.model("Blog",BlogSchema);

app.get('/',function(req,res){
	res.redirect("/blogs");
});

app.get('/blogs', function(req, res){
	Blog.find({}, function(err, blogs){
		if(err){
			console.log('ERROR!!!!!!!');
		}else{
			res.render('index', {blogs: blogs})
		}
	}); 
});	


app.get('/blogs/new',function(req,res){
	 res.render('new');
});

app.post('/blogs',function(req, res){
	Blog.create(req.body.blog  , function(err, newBlog) {
		if(err){
			res.render("new");
		}
		else{
			res.redirect('/blogs');
		}
	});
});

app.get('/blogs/:id', function(req,res){
	 // res.send("Hello World" + req.params.id);
	 Blog.findById(req.params.id, function(err, foundBlog){
	 	if(err){
	 		res.redirect("/blogs");
	 	}
	 	else{
	 		res.render("show", {blog: foundBlog});
	 	}
	 });
});

app.get('/blogs/:id/edit', function(req,res){
	Blog.findById(req.params.id, function(err, foundBlog){
		if(err){
			res.send("ERRROR")
			res.redirect('/blog');
		}
		else{
			res.render('edit',{blog: foundBlog});
		}
	});
});

app.put('/blogs/:id', function(req,res){
	Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
	  if(err){
	  	res.redirect('/blogs');
	  }
	  else{
	  	res.redirect('/blogs/'+req.params.id);
	  }
	});
});

app.delete("/blogs/:id", function(req,res){
	Blog.findByIdAndRemove(req.params.id, function(err){
		if(err){
			res.redirect('/blogs');
		}
		else{
			res.redirect('/blogs');
		}
	});
});

app.listen(3000, function(req, res){
	console.log('Server Has Started');
})