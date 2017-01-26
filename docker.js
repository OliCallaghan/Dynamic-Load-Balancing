var dockerode = require('dockerode');
var docker = new dockerode({socketPath: '/var/run/docker.sock'});

var haproxy = require('./HAProxy/haproxy.js');

const image = "dynamic_node";
var haproxyid;

module.exports = {
	rescale: function (nodes, callback) {
		console.log(nodes);
		docker.listContainers(function (err, containers) {
			var runningContainers = [];
			containers.forEach(function (containerInfo) {
				if ((containerInfo.Image == image) && (containerInfo.State == "running")) {
					runningContainers.push(containerInfo);
				} else if (containerInfo.Image == "haproxy") {
					haproxyid = containerInfo.Id;
				}
			});

			// runningContainers = X
			if (runningContainers.length == nodes) {
				// Do Nothing
				callback();
			} else if (runningContainers.length < nodes) {
				// Initialise More Nodes
				var newNodes = nodes - runningContainers.length;
				for (var n = 0; n < newNodes; n++) {
					(function (n) {
						// Initialise New Node
						docker.createContainer({Image: image}, function (err, container) {
							container.start(function (err, data) {
								// Container Started
								container.inspect(function (err, data) {
									haproxy.addNode(data.Id, data.NetworkSettings.IPAddress, function () {
										if (n == rmNodes - 1) {
											docker.getContainer(haproxyid).kill({signal: 'HUP'}, function () {
												console.log('reloaded');
											});
										}
									});
								});
							});
						});
					})(n);
				}
			} else if (runningContainers.length > nodes) {
				// Remove Nodes
				var rmNodes = runningContainers.length - nodes;
				for (var n = 0; n < rmNodes; n++) {
					(function (n) {
						// Remove Node
						var container = docker.getContainer(runningContainers[n].Id);
						container.inspect(function (err, data) {
							haproxy.removeNode(runningContainers[n].Id, data.NetworkSettings.IPAddress, function (success) {
								if (success == true) {
									container.stop(function () {
										container.remove(function () {
											console.log('removed');
										});
									});
								}
								if (n == rmNodes - 1) {
									docker.getContainer(haproxyid).kill({signal: 'HUP'}, function () {
										console.log('reloaded');
									});
								}
							});
						});
					})(n);
				}
			}
		});
	}
};
