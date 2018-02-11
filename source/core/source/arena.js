/*
 * Addon Arena Script
 * Author: DarkThanos, GreatApo
 */

// Location
var gca_arena = {
	inject : function(){
		(gca_options.bool("arena","ignore_attack_confirmations") &&
			this.ignore_attack_confirmations());
			
		// Normal arena
		if (gca_section.submod == null) {
			(gca_options.bool("arena","show_simulator_imagelink") &&
				this.show_simulator());
			this.show_gca_global_arena();
			
		// Server Arena / Server Turma
		} else if(gca_section.submod === 'serverArena') {
			this.sort_by_lvl();
			
			if (gca_getPage.parameter('aType') == 2) {
				// Normal
				(gca_options.bool("arena","show_simulator_imagelink") &&
					this.show_simulator());
				
			} else {
				//Turma
				
			}
			
		// Turma
		} else {
			
		}

		// Setting Link
		gca_tools.create.settingsLink("arena");
	},

	// Show Simulator
	show_simulator : function(){
		var sim_link = document.createElement('a');
		sim_link.href = "http://gladiatussimulator.tk/";
		sim_link.setAttribute("target","_blank");
		sim_link.style = "text-decoration: none;";
		document.getElementById('content').getElementsByTagName('article')[0].parentNode.insertBefore(sim_link, document.getElementById('content').getElementsByTagName('article')[0]);
		
		var sim_image = document.createElement('div');
		sim_image.className = "gca_arena-simulator-img";
		sim_link.appendChild(sim_image);
		
		var sim_text = document.createElement('div');
		sim_text.textContent = "Before attacking, use the...";
		sim_image.appendChild(sim_text);
	},
	
	// Show GCA Global Arena
	show_gca_global_arena : function(){
		// Add br
		let temp_element = document.createElement('br');
		document.getElementById('content').getElementsByTagName('article')[0].appendChild(temp_element);
		// Add header
		temp_element = document.createElement('h2');
		temp_element.className = "section-header";
		temp_element.textContent = "Global Arena (Crazy Addon)";
		//temp_element.style = "cursor: pointer;";
		document.getElementById('content').getElementsByTagName('article')[0].appendChild(temp_element);
		// Add box
		temp_element = document.createElement('section');
		temp_element.id = "global_arena_box";
		temp_element.style = "display: block;";
		document.getElementById('content').getElementsByTagName('article')[0].appendChild(temp_element);
		// Add text
		temp_element = document.createElement('p');
		temp_element.textContent = 'This is the ultimate arena gathering gladiators from all around the world! In this arena gladiators do not fight for gold or experience, they fight to find out who is the best gladiator in the world!';
		temp_element.style="text-align: justify;";
		document.getElementById('global_arena_box').appendChild(temp_element);
		// Add button
		temp_element = document.createElement('input');
		temp_element.type = "button";
		temp_element.className = "awesome-button";
		temp_element.value = "Load enemies list";
		temp_element.style = "margin-bottom: 15px;";
		temp_element.id = "load_global_arena";
		temp_element.setAttribute("onclick","gca_arena_load_enemies()");
		document.getElementById('global_arena_box').appendChild(temp_element);
		
		window.gca_arena_load_enemies = function() {
			jQuery.ajax({
				type: "GET",
				url: "http://gladiatuscrazyaddon.tk/arena/ajax.php?player_id="+gca_section.playerId+"&server="+gca_section.server+"&country="+gca_section.country,
				success: function(content){
					try {
						var obj = JSON.parse(content);
					} catch (e) {
						gca_notifications.error("Something went wrong.");
						return;
					}
					
					gca_arena_make_list(obj.list);
				},
				error: function(jqXHR, exception){
					if(jqXHR.status == 0){
						gca_notifications.error("Our server is still HTTP and not HTTPS. If you want to continue allow script load of unauthenticated sources on this page.");
					}else{
						gca_notifications.error("Connection error.");
					}
				}
			});
		}
		
		window.gca_arena_attack_enemy = function(country_B,server_B,player_id_B) {
			jQuery.ajax({
				type: "GET",
				url: "http://gladiatuscrazyaddon.tk/arena/ajax.php?player_id_A="+gca_section.playerId+"&server_A="+gca_section.server+"&country_A="+gca_section.country+"&player_id_B="+player_id_B+"&server_B="+server_B+"&country_B="+country_B,
				success: function(content){
					try {
						var obj = JSON.parse(content);
					} catch (e) {
						gca_notifications.error("Something went wrong.");
						return;
					}
					
					if(obj.error){
						gca_notifications.error("Something went wrong.");
					}else if(obj.status){
						if(obj.status == 'lost'){
							gca_notifications.error("You lost the fight :( ");
						}else if(obj.status == 'won'){
							gca_arena_make_list(obj.list);
							gca_notifications.success("You won!");
						}else if(obj.status == 'cooldown'){
							gca_notifications.warning("You are on cooldown. Please wait 10 min.");
						}else{
							gca_notifications.error("Something went wrong.");
						}
					}else{
						gca_notifications.error("Something went wrong.");
					}
					
				},
				error: function(){
					gca_notifications.error("Connection error.");
				}
			});
		}
		
		window.gca_arena_make_list = function(list) {
			let div = document.getElementById('global_arena_box');
			while(div.firstChild){
				div.removeChild(div.firstChild);
			}
			
			// Add text
			let temp_element = document.createElement('p');
			temp_element.textContent = 'This is the ultimate arena gathering gladiators from all around the world! In this arena gladiators do not fight for gold or experience, they fight to find out who is the best gladiator in the world!';
			temp_element.style="text-align: justify;";
			div.appendChild(temp_element);
			
			temp_element = document.createElement("table");
			temp_element.width = "80%";
			div.appendChild(temp_element);
			
			let div2 = document.getElementById('content').getElementsByTagName('article')[0].getElementsByClassName('right')[0].getElementsByTagName('tr');
			let position = div2[0].getElementsByTagName('th')[0].textContent;
			let name = div2[0].getElementsByTagName('th')[1].textContent;
			let my_name = div2[div2.length-1].getElementsByTagName('td')[0].textContent;
			
			temp_element = document.createElement("tr");
			div.getElementsByTagName('table')[0].appendChild(temp_element);
			
			let temp_element2 = document.createElement("th");
			temp_element2.textContent = position;
			temp_element2.width = "10%";
			temp_element.appendChild(temp_element2);
			
			temp_element2 = document.createElement("th");
			temp_element2.textContent = name;
			temp_element2.width = "30%";
			temp_element.appendChild(temp_element2);
			
			temp_element2 = document.createElement("th");
			temp_element2.textContent = 'Country';
			temp_element2.width = "20%";
			temp_element2.style= "text-align: center;";
			temp_element.appendChild(temp_element2);
			
			temp_element2 = document.createElement("th");
			temp_element2.width = "20%";
			temp_element2.textContent = " ";
			temp_element.appendChild(temp_element2);
			
			let temp_element3;
			
			for(i=0;i<list.length;i++){
				temp_element = document.createElement("tr");
				div.getElementsByTagName('table')[0].appendChild(temp_element);
				
				temp_element2 = document.createElement("th");
				temp_element2.textContent = list[i].position;
				last_position = list[i].position;
				temp_element.appendChild(temp_element2);
				
				temp_element2 = document.createElement("td");
				//temp_element2.textContent = list[i].name;
				temp_element.appendChild(temp_element2);
				
				//https://s4-gr.gladiatus.gameforge.com/game/index.php?mod=player&p=119682
				temp_element3 = document.createElement("a");
				temp_element3.href = "https://s"+list[i].server+"-"+list[i].country+".gladiatus.gameforge.com/game/index.php?mod=player&p="+list[i].id;
				temp_element3.textContent = list[i].name;
				temp_element3.setAttribute("target","_blank");
				temp_element2.appendChild(temp_element3);
				
				temp_element2 = document.createElement("td");
				//temp_element2.textContent = list[i].country;
				temp_element2.style= "text-align: center;";
				temp_element.appendChild(temp_element2);
				
				temp_element3 = document.createElement("img");
				temp_element3.src = "https://flags.fmcdn.net/data/flags/h20/"+list[i].country+".png";
				temp_element3.style = "height: 12px;";
				temp_element3.dataset.tooltip = '[[[["Country:","'+list[i].country.toUpperCase()+'"],["#fff;font-size:12px;","#fff;font-size:12px;"]],[["Server:","'+list[i].server+'"],["#fff;font-size:12px;","#fff;font-size:12px;"]]]]';
				temp_element2.appendChild(temp_element3);
				
				temp_element2 = document.createElement("td");
				//temp_element2.textContent = list[i].id;
				temp_element.appendChild(temp_element2);
				
				temp_element3 = document.createElement("div");
				temp_element3.className = "attack";
				temp_element3.setAttribute("onclick","gca_arena_attack_enemy('"+list[i].country+"',"+list[i].server+","+list[i].id+")");
				temp_element3.dataset.tooltip = '[[["Attack '+list[i].name+'","#fff;font-size:12px;"]]]';
				temp_element2.appendChild(temp_element3);
			}
			
			temp_element = document.createElement("tr");
			div.getElementsByTagName('table')[0].appendChild(temp_element);
			
			temp_element2 = document.createElement("th");
			temp_element2.textContent = list[0].position+1;
			temp_element.appendChild(temp_element2);
			
			temp_element2 = document.createElement("th");
			temp_element2.textContent = my_name;
			temp_element.appendChild(temp_element2);
			
			temp_element2 = document.createElement("td");
			temp_element2.style= "text-align: center;";
			temp_element.appendChild(temp_element2);
			
			temp_element3 = document.createElement("img");
			temp_element3.src = "https://flags.fmcdn.net/data/flags/h20/"+gca_section.country+".png";
			temp_element3.style = "height: 12px;";
			temp_element3.dataset.tooltip = '[[[["Country:","'+gca_section.country.toUpperCase()+'"],["#fff;font-size:12px;","#fff;font-size:12px;"]],[["Server:","'+gca_section.server+'"],["#fff;font-size:12px;","#fff;font-size:12px;"]]]]';
			temp_element2.appendChild(temp_element3);
			
			temp_element2 = document.createElement("td");
			temp_element2.textContent = " ";
			temp_element.appendChild(temp_element2);
		}
	},
	
	// Ignore attack confirmations
	ignore_attack_confirmations : function(){
		// New arena attack functions
		window.gca_startFight = function(b, a) {	
			jQuery("#errorRow").css({display: "none"});
			sendRequest("get", "ajax/doArenaFight.php", "did=" + a + "&c=1", b)
		}
		
		window.gca_startGroupFight = function(b, a) {
			jQuery("#errorRow").css({display: "none"});
			sendRequest("get", "ajax/doGroupFight.php", "did=" + a + "&c=1", b)
		}
		
		window.gca_startProvinciarumFight = function(d, a, c, b, e) {
			jQuery("#errorRow").css({display: "none"});
			sendRequest("get", "ajax.php", "mod=arena&submod=confirmDoCombat&aType=" + a + "&opponentId=" + c + "&serverId=" + b + "&country=" + e, d)
		}
		
		var attack_buttons = document.getElementsByClassName('attack');
		for(i=0;i<attack_buttons.length;i++){
			if(attack_buttons[i].getAttribute("onclick").match(/startFight|startGroupFight|startProvinciarumFight/i))
				attack_buttons[i].setAttribute("onclick","gca_"+attack_buttons[i].getAttribute("onclick"));
		}
	},
	
	// Re-arrange by lvl
	sort_by_lvl : function(){
		// If no opponents
		if (document.getElementById('own2') == null && document.getElementById('own3') == null) {
			return;
		}

		// Get rows
		let rows = (document.getElementById('own2') != null) ? document.getElementById('own2').getElementsByTagName('tr') : document.getElementById('own3').getElementsByTagName('tr');
		// Create players object
		let players = [];
		for (let i = 1; i <= 5; i++) {
			players.push({
				level : parseInt(rows[i].getElementsByTagName('td')[1].textContent, 10),
				element : rows[i]
			});
		}
		// Sort players
		players.sort(function(a,b) {return (a.level > b.level) ? 1 : ((b.level > a.level) ? -1 : 0);});
		// Insert
		let table = rows[0].parentNode;
		for (let i = 0; i < players.length; i++) {
			table.appendChild(players[i].element);
		}
	}
};

(function(){
	// On page load
	var loaded = false;
	var fireLoadEvent = function(){
		if(loaded) return;
		loaded = true;
		// Call handler
		gca_arena.inject();
	}
	if(document.readyState == "complete" || document.readyState == "loaded"){
		fireLoadEvent();
	}else{
		window.addEventListener('DOMContentLoaded', function(){
			fireLoadEvent();
		}, true);
		window.addEventListener('load', function(){
			fireLoadEvent();
		}, true);
	}
})();