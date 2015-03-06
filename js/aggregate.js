function date(task) {
  var now = new Date(),
      today = now.toLocaleDateString(),
      yesterday = (new Date(now.getTime() - 24*60*60*1000)).toLocaleDateString(),
      taskDate = (new Date(task.timestamp)).toLocaleDateString();

  return [taskDate === today ? 'today'
          : taskDate === yesterday ? 'yesterday'
            : taskDate];
}


var project = (task) => [task.project];
var tags = (task) => task.tags;


module.exports = {
  date: date,
  project: project,
  tags: tags,
}
