#!/bin/zsh

git add . 
git commit -m "automated commit"
git push 

npm run deploy 

