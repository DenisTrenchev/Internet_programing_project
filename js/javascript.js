$(document).ready(function(){
	"uses strict";
	var ENDPOINT = "http://localhost:3000/";

	var userID = 0;

	function visualisePost2(post_id){
		var _url = ENDPOINT + "posts?id="+post_id;

		var createPromise = $.ajax({
			url: _url,
			method: "GET",
			dataType: "JSON",
		}).then(function(responce){
			$("#dajmicontent").text(responce[0].post_content);
			$("#dajmiposta").show("slow");
		});
	}

	function check(){
			var name = $("#username").val();
			var pass = $("#password").val();

			if (name == ""){
				return false;
			}

			if (pass == ""){
				return false;
			}

			return true;
	}

	function check_login(){
			var name = $("#username-login").val();
			var pass = $("#password-login").val();
			if (name == ""){
				return false;
			}

			if (pass == ""){
				return false;
			}

			return true;
	}

	function doMagic(responce){
		$("#username2").text(responce[0].username);
		userId = responce[0].id;
		$("#login-register");
		$("#ifImIn").show("slow");
		$("#ifImIn").css("display","inline-block");
		visualisePosts();
	}

	function makePost(){
		var postData = $("#makePost").val();

		var _url = ENDPOINT + "posts";
		data = {
			"user_id": userId,
			"post_content": postData
		}

		var createPromise = $.ajax({
			url: _url,
			method: "POST",
			contentType: "application/json; charset=utf-8",
			data: JSON.stringify(data),
			dataType: "json"
		}).then(function(responce){
			$("#makeNewPost");
			visualisePosts();
		});
	}

	function visualisePosts(){
		var _url = ENDPOINT+"posts?user_id="+userId;
		
		function visualisePost(post){
			var item = $("<li />");
			item.text(post.post_content);
			item.attr("data-id", post.id);

			$("#postove").append(item);
		}

		var createPromise = $.ajax({
			url: _url,
			method: "GET",
			dataType: "JSON",
		}).then(function(responce){
			$("#postove").html("");
			_.forEach(responce, visualisePost);
			$("#visualisePosts").show("slow");
		})
	}

	function registerUser(){
		var user = $("#username").val();
		var pass = $("#password").val();
		data = {
			"username": user,
			"password": pass,
		}

		_url = ENDPOINT + "users";
		var createPromise = $.ajax({
			url: _url,
			method: "POST",
			contentType: "application/json; charset=utf-8",
			data: JSON.stringify(data),
			dataType: "json"
		}).then(function(responce){
			console.log(responce);
		});
	}

	function deletePost(id){
		var _url = ENDPOINT+"posts/"+id;
		console.log(_url);

		var createPromise = $.ajax({
			url: _url,
			method: "DELETE"
		}).then(function(){
			$("#dajmiposta").hide("slow");
			visualisePosts();
		});
	}

	function editPost(data, id){
		var _url = ENDPOINT+"posts/"+id;
		data = {
			"post_content": data,
			"user_id": userId
		}
		var createPromise = $.ajax({
			url: _url,
			method: "PUT",
			contentType: "application/json; charset=utf-8",
			data: JSON.stringify(data),
		}).then(function(){
			$("#dajmiposta").hide("slow");
			visualisePost2(id)
			$("#dajmiposta").show("slow");
			visualisePosts();
		});
	}

	function checkIfUserExists(){
		var user = $("#username").val();
		var pass = $("#password").val();
		
		_url = ENDPOINT+"users"+"?username="+user;

		var createPromise = $.ajax({
			url: _url,
			method: "GET",
			dataType: "JSON"
		}).then(function(responce){
			if (responce == ""){
				registerUser();
			} else {
				alert("username is already taken");
			}
		});
	}

	function login(){
		var name = $("#username-login").val();
		var pass = $("#password-login").val();
	
		_url = ENDPOINT+"users"+"?username="+name+"&password="+pass;
		var createPromise = $.ajax({
			url: _url,
			method: "GET",
			dataType: "JSON"
		}).then(function(responce){
			if (responce == ""){
				alert("Wrong username or password!");
			} else {
				doMagic(responce);
			}
		});
	}

	function attachHandlers(){
		$(document).on("click", "[data-id]", function(){
			var id = $(this).attr("data-id");
			$("#dajmiposta").hide("slow");
			$("#dajmiposta").attr("data-id-2", id);
			visualisePost2(id);
		});

		$("#register").on("click", function(){
			if (check()){
				checkIfUserExists();
			}
		});
		
		$("#logIn").on("click", function(){
			if (check_login()) {
				login();
			}
		});

		$("#makePostButton").on("click", function(){
			makePost();
		});

		$("#editPostButton").on("click", function(){			
			var data = prompt("Моля въведете новия текст:", "Test data");
			var id= $(this).parent().attr("data-id-2");
			editPost(data, id);
		});
	
		$("#deletePostButton").on("click", function(){
			var id= $(this).parent().attr("data-id-2");
			deletePost(id);
		})
	}

	attachHandlers();

})