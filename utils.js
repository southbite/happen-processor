module.exports = {
	appendIfNotAtEnd:function(path, suffix){
		if (path.substring(path.length - 1, path.length) != suffix)
			path = path + suffix;
		
		return path;
	},
	slurpArgs:function(args, requiredArgs){
		var slurped = {};
		
		args.map(function(current, index, array){
			var arg = current.split("=");
			slurped[arg[0].toLowerCase()] = arg[1];
		});
		
		for (var argIndex in requiredArgs)
			if (slurped[requiredArgs[argIndex]] == null)
				throw "Required argument " + requiredArgs[argIndex] + " not found.";
		
		return slurped;
	}
}