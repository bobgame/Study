$hash = @{"AR"="ar";"BR"="pt-br";"CR"="hr";"CZ"="cs";"DK"="da";
			"FI"="fi";"FR"="fr";"GK"="el";"GR"="de";"HE"="he";
			"HU"="hu";"IT"="it";"JP"="ja";"KR"="ko";"NL"="nl";
			"NO"="nb";"PL"="pl";"PO"="pt";"RO"="ro";"RU"="ru";
			"SC"="zh-hans";"SH"="sr-latn";"SK"="sk";"SL"="sl";
			"SP"="es";"SV"="sv";"TC"="zh-hant";"TU"="tr";"UA"="uk"}
Get-ChildItem ./ | ForEach-Object -Process{
	if($_-is [System.IO.DirectoryInfo]){
		if($hash.contains($_.name)){
			if(-not (Test-path json)){
				mkdir json
			}
			$path = $_.name+"/"
			$contents = $path + (Get-ChildItem -Path $path -Force -Recurse -File | Select-Object -First 1)
			$new_path = "json/"+$hash[$_.name]+".json"
			Move-Item $contents $new_path
			Remove-Item $_.name
		}
	}
}