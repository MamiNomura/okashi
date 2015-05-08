describe('sample e2e test', function() {

	it('It starts with /app/playlist', function() {
		// browser.debugger()		
		expect(browser.getCurrentUrl()).toContain('/app/playlist');
	});

	// it('Hitting chats tab will go to /tab/chats', function() {
	// 	// browser.debugger()
	// 	var tab = element(by.css('.ion-ios-chatboxes-outline'));
	// 	// adding a small wait since it takes a while to get to index.html
	// 	setTimeout(function() {
	// 		tab.click().then(function() {
	// 			expect(browser.getCurrentUrl()).toContain('/tab/chats');
	// 		});

	// 	}, 1);


	// })


	// it('should greet the named user', function() {
	//   browser.get('http://www.angularjs.org');

	//   element(by.model('yourName')).sendKeys('Julie');

	//   var greeting = element(by.binding('yourName'));

	//   expect(greeting.getText()).toEqual('Hello Julie!');
	// });

});