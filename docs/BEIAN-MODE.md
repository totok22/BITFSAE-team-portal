# beian-mode 使用与快速切换

## 目标

当前分支只保留一个首页用于“个人车辆数据遥测测试”展示，便于部署与审核。

## 本地切换

### 切到备案页分支（1 条命令）

```bash
git checkout beian-mode
```

### 切回车队网站分支（1 条命令）

```bash
git checkout main
```

## 部署切换（GitHub Actions）

当前 `deploy.yml` 已支持 `main` 和 `beian-mode` 两个分支推送触发部署。

### 部署备案页（2 条命令）

```bash
git checkout beian-mode
git push origin beian-mode
```

### 切回部署车队网站（2 条命令）

```bash
git checkout main
git push origin main
```

## 备注

- 页脚备案信息沿用原站点最后一行展示。
- 除首页外，其它主要代码已恢复，改动最小化。
