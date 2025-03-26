module github.com/sbrow/sbrow.github.io

go 1.23.3

replace github.com/sbrow/sbrow.github.io/themes/my-theme => ./themes/my-theme

require github.com/hugomods/icons/vendors/lucide v0.3.40 // indirect

require (
	github.com/hugomods/icons/vendors/bootstrap v0.5.9 // indirect
	github.com/sbrow/sbrow.github.io/themes/my-theme v0.0.0-00010101000000-000000000000 // indirect
)
