export function DateFormat(date) {
	//02-05-2020T00:00:00
	const dateInformation = date.split('T')[0].split('-'); // [02,05,2020]
	const newDate = new Date(
		`${dateInformation[1]}-${dateInformation[2]}-${dateInformation[0]}`
	);

	const options = {
		week: 'long',
		year: 'numeric',
		month: 'long',
		day: 'numeric',
	};

	return newDate.toLocaleDateString('en-EN', options);
}
