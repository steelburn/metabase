git reset HEAD~1
rm ./backport.sh
git cherry-pick b3f4fd20d86c99d71f3875259adc34c7fa882126
echo 'Resolve conflicts and force push this branch.\n\nTo backport translations run: bin/i18n/merge-translations <release-branch>'
