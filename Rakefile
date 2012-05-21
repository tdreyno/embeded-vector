desc "Run tests with phantomjs"
task :test do
  unless system("which phantomjs > /dev/null 2>&1")
    abort "PhantomJS is not installed. Download from http://phantomjs.org"
  end

  cmd = "phantomjs tests/qunit/run-qunit.js \"file://localhost#{File.dirname(__FILE__)}/tests/index.html\""
  system(cmd)

  # A bit of a hack until we can figure this out on Travis
  tries = 0
  while tries < 3 && $?.exitstatus === 124
    tries += 1
    puts "Timed Out. Trying again..."
    system(cmd)
  end

  if $?.success?
    puts "Tests Passed"
  else
    puts "Tests Failed"
    exit(1)
  end
end