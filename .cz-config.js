module.exports = {
  types: [
    { value: 'feat', name: 'feat:      新增加一个功能' },
    { value: 'fix', name: 'fix:       bug 修复' },
    { value: 'style', name: 'style:     代码风格更改，不涉及功能改变' },
    { value: 'perf', name: 'perf:      提升性能的修改' },
    { value: 'refactor', name: 'refactor:  不涉及修复bug和新功能开发的代码更改' },
    { value: 'docs', name: 'docs:      文档、注释发生改变' },
    { value: 'ci', name: 'ci:        修改配置文件和脚本' }
  ],
  skipQuestions: ['scope', 'ticketNumber', 'body', 'breaking', 'footer'],
  messages: {
    type: '选择提交的类型：\n',
    subject: '本次提交的主要内容：\n',
    confirmCommit: '是否确定提交?（回车确定)'
  }
}
