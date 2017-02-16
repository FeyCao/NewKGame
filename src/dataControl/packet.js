// JavaScript Document
function Packet()
{
	this.msgType="";
	this.content="";
}

Packet.prototype.Parse=function(message)
{
	var fields=message.split("|");
	if(fields.length<2) return null;
	var packetReutrn=new Packet();
	packetReutrn.msgType=fields[0];
	packetReutrn.content=fields[1];
	return packetReutrn;
}


