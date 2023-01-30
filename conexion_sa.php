<php
	$serverName="L8CG4330LMF\SQLEXPRESS";
	$connectionInfo=array("Database"=> "origen2022", "UID"=>"sa","PWD"=>"misaeL197520*","CharacterSet"=>"UTF-8");
	$con = sqlsrv_connect($serverName,$connectionInfo);

	if($con){
		echo "conexion exitosa";
	}else{  
		echo "fallo en la conexion";
	}
>