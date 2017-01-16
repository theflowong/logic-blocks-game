# refer to tutorial
# using sass with WordPress
# https://www.elegantthemes.com/blog/tips-tricks/how-to-use-sass-with-wordpress-a-step-by-step-guide

# Default Compass template config.rb

# Require any additional compass plugins here.
add_import_path "bower_components/foundation/scss"

# Set this to the root of your project when deployed:
http_path = "/" #root level target path
css_dir = "css" #targets our default style.css file at the root level of our theme
sass_dir = "sass" #targets our sass directory
images_dir = "img" #targets our pre existing image directory
javascripts_dir = "js" #targets our JavaScript directory

# select preferred output style (can be overriden via the command line)
output_style = :nested; #:compressed #or :expanded or :nested or :compact or :compressed

# To enable relative paths to assets via compass helper functions.
# note: this is important in wordpress themes for sprites

relative_assets = true
