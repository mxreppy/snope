# snope
node.js soap testing repo: [public github](https://github.com/mxreppy/snope)

# soap resources (free web services)

[actionscript.org](http://www.actionscript.org/forums/showthread.php3?t=70742)  This link is currently down, but 
here's a google cache:


[http://webcache.googleusercontent.com/...](http://webcache.googleusercontent.com/search?q=cache:mXmVn6osczcJ:www.actionscript.org/forums/printthread.php3%3Ft%3D70742%26pp%3D40+&cd=1&hl=en&ct=clnk&gl=us)

# nodejs soap library

Github:[node-soap](https://github.com/vpulim/node-soap)
npm: [soap](https://www.npmjs.com/package/soap)


note that the npm page appears to point at a different repo, but that link redirects to the vpulim based one which appears to be the current maintainer (and that repo has lots of recent activity).   Both docs reflect the same basic api so it's just the natural progression of open source software...

# TL;DR: simple web server with express

see below for the description of the soap service wrapped

* from [express generator](http://expressjs.com/starter/generator.html)
* implement get & post to `/zipdata` wrapping the soap call, using param/query `zip=<zipcode>`
* brief home page on `\` with instructions
* instructions to run on localhost (port 3000 by default)

    1.  `npm install .`   # install deps
    2.  `./bin/www`    # excecutable server script provided by express generator

* curl get example:

```
$ curl -s http://localhost:3000/zipdata?zip=01002 | jq "."
{
  "CITY": "Amherst",
  "STATE": "MA",
  "ZIP": "01002",
  "AREA_CODE": "413",
  "TIME_ZONE": "E"
}
```

* curl post example:

```
$ curl -s 'http://localhost:3000/zipdata'    -H'Content-Type: application/json'    -H'Accept: text/html,application/json'    --data '{"zip":"01002"}' | jq "."
{
  "CITY": "Amherst",
  "STATE": "MA",
  "ZIP": "01002",
  "AREA_CODE": "413",
  "TIME_ZONE": "E"
}
```


# development spike

Wrap a sample SOAP call with an http endpoint to make use easier by other clients

Web service (public) http://www.webservicex.net/uszip.asmx?WSDL

* service: `wsdl:service name="USZip"`
    * port: `wsdl:port name="USZipSoap"`
        * operation `wsdl:operation name="GetInfoByZIP"`
            * in: `<wsdl:input message="tns:GetInfoByZIPSoapIn"/>`
                * accepts one parameter `<wsdl:part name="parameters" element="tns:GetInfoByZIP"/>` which in turn accepts one parameter (string) of `USZip`
            * out: `<wsdl:output message="tns:GetInfoByZIPSoapOut"/>`
                * returns one parameter `<wsdl:part name="parameters" element="tns:GetInfoByZIPResponse"/>`
                This looks like a variable result object.  
                                
                
Inspection of the call result data shows this structure:

```
{   GetInfoByZIPResult: { 
        NewDataSet: { 
            Table: [Object] 
        } 
    } 
}
```

where the object looks like 

```
{
  "AREA_CODE": "215", 
  "CITY": "Philadelphia", 
  "STATE": "PA", 
  "TIME_ZONE": "E", 
  "ZIP": "19143"
}

```

so an appropriate http wrapper would be a `GET` (or `POST`) with input zipcode and a json response of the result object.


# reference

The whole wsdl for reference:
```
<wsdl:definitions xmlns:tm="http://microsoft.com/wsdl/mime/textMatching/" xmlns:soapenc="http://schemas.xmlsoap.org/soap/encoding/" xmlns:mime="http://schemas.xmlsoap.org/wsdl/mime/" xmlns:tns="http://www.webserviceX.NET" xmlns:soap="http://schemas.xmlsoap.org/wsdl/soap/" xmlns:s="http://www.w3.org/2001/XMLSchema" xmlns:soap12="http://schemas.xmlsoap.org/wsdl/soap12/" xmlns:http="http://schemas.xmlsoap.org/wsdl/http/" xmlns:wsdl="http://schemas.xmlsoap.org/wsdl/" targetNamespace="http://www.webserviceX.NET">
<wsdl:types>
<s:schema elementFormDefault="qualified" targetNamespace="http://www.webserviceX.NET">
<s:element name="GetInfoByZIP">
<s:complexType>
<s:sequence>
<s:element minOccurs="0" maxOccurs="1" name="USZip" type="s:string"/>
</s:sequence>
</s:complexType>
</s:element>
<s:element name="GetInfoByZIPResponse">
<s:complexType>
<s:sequence>
<s:element minOccurs="0" maxOccurs="1" name="GetInfoByZIPResult">
<s:complexType mixed="true">
<s:sequence>
<s:any/>
</s:sequence>
</s:complexType>
</s:element>
</s:sequence>
</s:complexType>
</s:element>
<s:element name="GetInfoByCity">
<s:complexType>
<s:sequence>
<s:element minOccurs="0" maxOccurs="1" name="USCity" type="s:string"/>
</s:sequence>
</s:complexType>
</s:element>
<s:element name="GetInfoByCityResponse">
<s:complexType>
<s:sequence>
<s:element minOccurs="0" maxOccurs="1" name="GetInfoByCityResult">
<s:complexType mixed="true">
<s:sequence>
<s:any/>
</s:sequence>
</s:complexType>
</s:element>
</s:sequence>
</s:complexType>
</s:element>
<s:element name="GetInfoByState">
<s:complexType>
<s:sequence>
<s:element minOccurs="0" maxOccurs="1" name="USState" type="s:string"/>
</s:sequence>
</s:complexType>
</s:element>
<s:element name="GetInfoByStateResponse">
<s:complexType>
<s:sequence>
<s:element minOccurs="0" maxOccurs="1" name="GetInfoByStateResult">
<s:complexType mixed="true">
<s:sequence>
<s:any/>
</s:sequence>
</s:complexType>
</s:element>
</s:sequence>
</s:complexType>
</s:element>
<s:element name="GetInfoByAreaCode">
<s:complexType>
<s:sequence>
<s:element minOccurs="0" maxOccurs="1" name="USAreaCode" type="s:string"/>
</s:sequence>
</s:complexType>
</s:element>
<s:element name="GetInfoByAreaCodeResponse">
<s:complexType>
<s:sequence>
<s:element minOccurs="0" maxOccurs="1" name="GetInfoByAreaCodeResult">
<s:complexType mixed="true">
<s:sequence>
<s:any/>
</s:sequence>
</s:complexType>
</s:element>
</s:sequence>
</s:complexType>
</s:element>
</s:schema>
</wsdl:types>
<wsdl:message name="GetInfoByZIPSoapIn">
<wsdl:part name="parameters" element="tns:GetInfoByZIP"/>
</wsdl:message>
<wsdl:message name="GetInfoByZIPSoapOut">
<wsdl:part name="parameters" element="tns:GetInfoByZIPResponse"/>
</wsdl:message>
<wsdl:message name="GetInfoByCitySoapIn">
<wsdl:part name="parameters" element="tns:GetInfoByCity"/>
</wsdl:message>
<wsdl:message name="GetInfoByCitySoapOut">
<wsdl:part name="parameters" element="tns:GetInfoByCityResponse"/>
</wsdl:message>
<wsdl:message name="GetInfoByStateSoapIn">
<wsdl:part name="parameters" element="tns:GetInfoByState"/>
</wsdl:message>
<wsdl:message name="GetInfoByStateSoapOut">
<wsdl:part name="parameters" element="tns:GetInfoByStateResponse"/>
</wsdl:message>
<wsdl:message name="GetInfoByAreaCodeSoapIn">
<wsdl:part name="parameters" element="tns:GetInfoByAreaCode"/>
</wsdl:message>
<wsdl:message name="GetInfoByAreaCodeSoapOut">
<wsdl:part name="parameters" element="tns:GetInfoByAreaCodeResponse"/>
</wsdl:message>
<wsdl:message name="GetInfoByZIPHttpGetIn">
<wsdl:part name="USZip" type="s:string"/>
</wsdl:message>
<wsdl:message name="GetInfoByZIPHttpGetOut">
<wsdl:part name="Body"/>
</wsdl:message>
<wsdl:message name="GetInfoByCityHttpGetIn">
<wsdl:part name="USCity" type="s:string"/>
</wsdl:message>
<wsdl:message name="GetInfoByCityHttpGetOut">
<wsdl:part name="Body"/>
</wsdl:message>
<wsdl:message name="GetInfoByStateHttpGetIn">
<wsdl:part name="USState" type="s:string"/>
</wsdl:message>
<wsdl:message name="GetInfoByStateHttpGetOut">
<wsdl:part name="Body"/>
</wsdl:message>
<wsdl:message name="GetInfoByAreaCodeHttpGetIn">
<wsdl:part name="USAreaCode" type="s:string"/>
</wsdl:message>
<wsdl:message name="GetInfoByAreaCodeHttpGetOut">
<wsdl:part name="Body"/>
</wsdl:message>
<wsdl:message name="GetInfoByZIPHttpPostIn">
<wsdl:part name="USZip" type="s:string"/>
</wsdl:message>
<wsdl:message name="GetInfoByZIPHttpPostOut">
<wsdl:part name="Body"/>
</wsdl:message>
<wsdl:message name="GetInfoByCityHttpPostIn">
<wsdl:part name="USCity" type="s:string"/>
</wsdl:message>
<wsdl:message name="GetInfoByCityHttpPostOut">
<wsdl:part name="Body"/>
</wsdl:message>
<wsdl:message name="GetInfoByStateHttpPostIn">
<wsdl:part name="USState" type="s:string"/>
</wsdl:message>
<wsdl:message name="GetInfoByStateHttpPostOut">
<wsdl:part name="Body"/>
</wsdl:message>
<wsdl:message name="GetInfoByAreaCodeHttpPostIn">
<wsdl:part name="USAreaCode" type="s:string"/>
</wsdl:message>
<wsdl:message name="GetInfoByAreaCodeHttpPostOut">
<wsdl:part name="Body"/>
</wsdl:message>
<wsdl:portType name="USZipSoap">
<wsdl:operation name="GetInfoByZIP">
<wsdl:documentation xmlns:wsdl="http://schemas.xmlsoap.org/wsdl/">
Get State Code,City,Area Code,Time Zone,Zip Code by Zip Code
</wsdl:documentation>
<wsdl:input message="tns:GetInfoByZIPSoapIn"/>
<wsdl:output message="tns:GetInfoByZIPSoapOut"/>
</wsdl:operation>
<wsdl:operation name="GetInfoByCity">
<wsdl:documentation xmlns:wsdl="http://schemas.xmlsoap.org/wsdl/">
Get State Code,City,Area Code,Time Zone,Zip Code by City
</wsdl:documentation>
<wsdl:input message="tns:GetInfoByCitySoapIn"/>
<wsdl:output message="tns:GetInfoByCitySoapOut"/>
</wsdl:operation>
<wsdl:operation name="GetInfoByState">
<wsdl:documentation xmlns:wsdl="http://schemas.xmlsoap.org/wsdl/">
Get State Code,City,Area Code,Time Zone,Zip Code by state
</wsdl:documentation>
<wsdl:input message="tns:GetInfoByStateSoapIn"/>
<wsdl:output message="tns:GetInfoByStateSoapOut"/>
</wsdl:operation>
<wsdl:operation name="GetInfoByAreaCode">
<wsdl:documentation xmlns:wsdl="http://schemas.xmlsoap.org/wsdl/">
Get State Code,City,Area Code,Time Zone,Zip Code by Area Code
</wsdl:documentation>
<wsdl:input message="tns:GetInfoByAreaCodeSoapIn"/>
<wsdl:output message="tns:GetInfoByAreaCodeSoapOut"/>
</wsdl:operation>
</wsdl:portType>
<wsdl:portType name="USZipHttpGet">
<wsdl:operation name="GetInfoByZIP">
<wsdl:documentation xmlns:wsdl="http://schemas.xmlsoap.org/wsdl/">
Get State Code,City,Area Code,Time Zone,Zip Code by Zip Code
</wsdl:documentation>
<wsdl:input message="tns:GetInfoByZIPHttpGetIn"/>
<wsdl:output message="tns:GetInfoByZIPHttpGetOut"/>
</wsdl:operation>
<wsdl:operation name="GetInfoByCity">
<wsdl:documentation xmlns:wsdl="http://schemas.xmlsoap.org/wsdl/">
Get State Code,City,Area Code,Time Zone,Zip Code by City
</wsdl:documentation>
<wsdl:input message="tns:GetInfoByCityHttpGetIn"/>
<wsdl:output message="tns:GetInfoByCityHttpGetOut"/>
</wsdl:operation>
<wsdl:operation name="GetInfoByState">
<wsdl:documentation xmlns:wsdl="http://schemas.xmlsoap.org/wsdl/">
Get State Code,City,Area Code,Time Zone,Zip Code by state
</wsdl:documentation>
<wsdl:input message="tns:GetInfoByStateHttpGetIn"/>
<wsdl:output message="tns:GetInfoByStateHttpGetOut"/>
</wsdl:operation>
<wsdl:operation name="GetInfoByAreaCode">
<wsdl:documentation xmlns:wsdl="http://schemas.xmlsoap.org/wsdl/">
Get State Code,City,Area Code,Time Zone,Zip Code by Area Code
</wsdl:documentation>
<wsdl:input message="tns:GetInfoByAreaCodeHttpGetIn"/>
<wsdl:output message="tns:GetInfoByAreaCodeHttpGetOut"/>
</wsdl:operation>
</wsdl:portType>
<wsdl:portType name="USZipHttpPost">
<wsdl:operation name="GetInfoByZIP">
<wsdl:documentation xmlns:wsdl="http://schemas.xmlsoap.org/wsdl/">
Get State Code,City,Area Code,Time Zone,Zip Code by Zip Code
</wsdl:documentation>
<wsdl:input message="tns:GetInfoByZIPHttpPostIn"/>
<wsdl:output message="tns:GetInfoByZIPHttpPostOut"/>
</wsdl:operation>
<wsdl:operation name="GetInfoByCity">
<wsdl:documentation xmlns:wsdl="http://schemas.xmlsoap.org/wsdl/">
Get State Code,City,Area Code,Time Zone,Zip Code by City
</wsdl:documentation>
<wsdl:input message="tns:GetInfoByCityHttpPostIn"/>
<wsdl:output message="tns:GetInfoByCityHttpPostOut"/>
</wsdl:operation>
<wsdl:operation name="GetInfoByState">
<wsdl:documentation xmlns:wsdl="http://schemas.xmlsoap.org/wsdl/">
Get State Code,City,Area Code,Time Zone,Zip Code by state
</wsdl:documentation>
<wsdl:input message="tns:GetInfoByStateHttpPostIn"/>
<wsdl:output message="tns:GetInfoByStateHttpPostOut"/>
</wsdl:operation>
<wsdl:operation name="GetInfoByAreaCode">
<wsdl:documentation xmlns:wsdl="http://schemas.xmlsoap.org/wsdl/">
Get State Code,City,Area Code,Time Zone,Zip Code by Area Code
</wsdl:documentation>
<wsdl:input message="tns:GetInfoByAreaCodeHttpPostIn"/>
<wsdl:output message="tns:GetInfoByAreaCodeHttpPostOut"/>
</wsdl:operation>
</wsdl:portType>
<wsdl:binding name="USZipSoap" type="tns:USZipSoap">
<soap:binding transport="http://schemas.xmlsoap.org/soap/http"/>
<wsdl:operation name="GetInfoByZIP">
<soap:operation soapAction="http://www.webserviceX.NET/GetInfoByZIP" style="document"/>
<wsdl:input>
<soap:body use="literal"/>
</wsdl:input>
<wsdl:output>
<soap:body use="literal"/>
</wsdl:output>
</wsdl:operation>
<wsdl:operation name="GetInfoByCity">
<soap:operation soapAction="http://www.webserviceX.NET/GetInfoByCity" style="document"/>
<wsdl:input>
<soap:body use="literal"/>
</wsdl:input>
<wsdl:output>
<soap:body use="literal"/>
</wsdl:output>
</wsdl:operation>
<wsdl:operation name="GetInfoByState">
<soap:operation soapAction="http://www.webserviceX.NET/GetInfoByState" style="document"/>
<wsdl:input>
<soap:body use="literal"/>
</wsdl:input>
<wsdl:output>
<soap:body use="literal"/>
</wsdl:output>
</wsdl:operation>
<wsdl:operation name="GetInfoByAreaCode">
<soap:operation soapAction="http://www.webserviceX.NET/GetInfoByAreaCode" style="document"/>
<wsdl:input>
<soap:body use="literal"/>
</wsdl:input>
<wsdl:output>
<soap:body use="literal"/>
</wsdl:output>
</wsdl:operation>
</wsdl:binding>
<wsdl:binding name="USZipSoap12" type="tns:USZipSoap">
<soap12:binding transport="http://schemas.xmlsoap.org/soap/http"/>
<wsdl:operation name="GetInfoByZIP">
<soap12:operation soapAction="http://www.webserviceX.NET/GetInfoByZIP" style="document"/>
<wsdl:input>
<soap12:body use="literal"/>
</wsdl:input>
<wsdl:output>
<soap12:body use="literal"/>
</wsdl:output>
</wsdl:operation>
<wsdl:operation name="GetInfoByCity">
<soap12:operation soapAction="http://www.webserviceX.NET/GetInfoByCity" style="document"/>
<wsdl:input>
<soap12:body use="literal"/>
</wsdl:input>
<wsdl:output>
<soap12:body use="literal"/>
</wsdl:output>
</wsdl:operation>
<wsdl:operation name="GetInfoByState">
<soap12:operation soapAction="http://www.webserviceX.NET/GetInfoByState" style="document"/>
<wsdl:input>
<soap12:body use="literal"/>
</wsdl:input>
<wsdl:output>
<soap12:body use="literal"/>
</wsdl:output>
</wsdl:operation>
<wsdl:operation name="GetInfoByAreaCode">
<soap12:operation soapAction="http://www.webserviceX.NET/GetInfoByAreaCode" style="document"/>
<wsdl:input>
<soap12:body use="literal"/>
</wsdl:input>
<wsdl:output>
<soap12:body use="literal"/>
</wsdl:output>
</wsdl:operation>
</wsdl:binding>
<wsdl:binding name="USZipHttpGet" type="tns:USZipHttpGet">
<http:binding verb="GET"/>
<wsdl:operation name="GetInfoByZIP">
<http:operation location="/GetInfoByZIP"/>
<wsdl:input>
<http:urlEncoded/>
</wsdl:input>
<wsdl:output>
<mime:content part="Body" type="text/xml"/>
</wsdl:output>
</wsdl:operation>
<wsdl:operation name="GetInfoByCity">
<http:operation location="/GetInfoByCity"/>
<wsdl:input>
<http:urlEncoded/>
</wsdl:input>
<wsdl:output>
<mime:content part="Body" type="text/xml"/>
</wsdl:output>
</wsdl:operation>
<wsdl:operation name="GetInfoByState">
<http:operation location="/GetInfoByState"/>
<wsdl:input>
<http:urlEncoded/>
</wsdl:input>
<wsdl:output>
<mime:content part="Body" type="text/xml"/>
</wsdl:output>
</wsdl:operation>
<wsdl:operation name="GetInfoByAreaCode">
<http:operation location="/GetInfoByAreaCode"/>
<wsdl:input>
<http:urlEncoded/>
</wsdl:input>
<wsdl:output>
<mime:content part="Body" type="text/xml"/>
</wsdl:output>
</wsdl:operation>
</wsdl:binding>
<wsdl:binding name="USZipHttpPost" type="tns:USZipHttpPost">
<http:binding verb="POST"/>
<wsdl:operation name="GetInfoByZIP">
<http:operation location="/GetInfoByZIP"/>
<wsdl:input>
<mime:content type="application/x-www-form-urlencoded"/>
</wsdl:input>
<wsdl:output>
<mime:content part="Body" type="text/xml"/>
</wsdl:output>
</wsdl:operation>
<wsdl:operation name="GetInfoByCity">
<http:operation location="/GetInfoByCity"/>
<wsdl:input>
<mime:content type="application/x-www-form-urlencoded"/>
</wsdl:input>
<wsdl:output>
<mime:content part="Body" type="text/xml"/>
</wsdl:output>
</wsdl:operation>
<wsdl:operation name="GetInfoByState">
<http:operation location="/GetInfoByState"/>
<wsdl:input>
<mime:content type="application/x-www-form-urlencoded"/>
</wsdl:input>
<wsdl:output>
<mime:content part="Body" type="text/xml"/>
</wsdl:output>
</wsdl:operation>
<wsdl:operation name="GetInfoByAreaCode">
<http:operation location="/GetInfoByAreaCode"/>
<wsdl:input>
<mime:content type="application/x-www-form-urlencoded"/>
</wsdl:input>
<wsdl:output>
<mime:content part="Body" type="text/xml"/>
</wsdl:output>
</wsdl:operation>
</wsdl:binding>
<wsdl:service name="USZip">
<wsdl:port name="USZipSoap" binding="tns:USZipSoap">
<soap:address location="http://www.webservicex.net/uszip.asmx"/>
</wsdl:port>
<wsdl:port name="USZipSoap12" binding="tns:USZipSoap12">
<soap12:address location="http://www.webservicex.net/uszip.asmx"/>
</wsdl:port>
<wsdl:port name="USZipHttpGet" binding="tns:USZipHttpGet">
<http:address location="http://www.webservicex.net/uszip.asmx"/>
</wsdl:port>
<wsdl:port name="USZipHttpPost" binding="tns:USZipHttpPost">
<http:address location="http://www.webservicex.net/uszip.asmx"/>
</wsdl:port>
</wsdl:service>
</wsdl:definitions>
```
>>>>>>> Stashed changes
