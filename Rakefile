# github
task :github_push do
  sh 'git push origin master'
end

# Node Ninja server
task :ssh do
  sh 'ssh node@210.152.156.63'
end

task :ninja_deploy => [:github_push] do
  sh 'git push node-ninja master'
end
