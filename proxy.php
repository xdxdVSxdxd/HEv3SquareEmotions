<?php

	if(isset($_REQUEST["url"])){
		echo(file_get_contents($_REQUEST["url"]));
	}

?>