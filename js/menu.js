function active_menu(x){
	switch (x){
		case 1:
			/*search active*/
			document.getElementById('search').className = "active";
			break;
		case 2:
			/*data structure active*/
			document.getElementById('data_structure').className = "active";
			break;
		case 3:
			// what and when inputer
			document.getElementById('query_inputer').className = "active";
			break;
		case 4:
			// where inputer
			document.getElementById('location_inputer').className = "active";
			break;
	}
}