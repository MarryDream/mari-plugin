<p align="center" >
    <a href="https://github.com/MarryDream/mari-plugin.git">
        <img src="https://mari-plugin.oss-cn-beijing.aliyuncs.com/logo.png" width="128" height="128" alt="Mari">
    </a>
</p>
<h2 align="center">茉莉|Mari-Plugin</h2>

# 简介

Mari-Plugin 为 [Adachi-BOT][1] 的衍生插件，用于实现部分实验性功能，并将在功能稳定后并入 [Adachi-BOT][1] 主项目。

- [Adachi-BOT][1]

# 安装插件

进入 `Adachi-BOT/src/plugins` 目录下，执行如下命令

```bash
git clone https://github.com/MarryDream/mari-plugin.git
```

或通过本项目仓库左上角 `code -> Download.zip` 下载压缩包，解压至 `Adachi-BOT/src/plugins` 目录内

> 注意：若使用下载压缩包方式，请务必删除解压后目录名字中的 `-master`，否则插件无法启动

## 更新方法

### 指令更新

使用 (header)`mari_update` 指令更新，需要项目不能以 `win-start` 方式启动。

### 手动更新

进入 `Adachi-BOT/src/plugins/mari-plugin` 目录下，执行以下命令即可

```bash
git pull
```

当然你也可以直接 下载本项目压缩包 整包替换。

# 插件功能

## 面板查询

数据来源于 https://enka.shinshin.moe/ ，支持 uid 与 @ 查询。

初始默认指令为 `#panel (UID|@) 角色名`，括号内为选填。

使用 `#panel_update` 更新面板数据，获取到的数据将会被保存，即使更换看板人物后依然可以查询。  
`#panel_update` 指令同样支持 `@` 与 `uid` 更新，且允许使用 `#panel_update -c` 清空自己当前保存的面板数据。

### 配置项

初次运行会在 `Adachi-BOT/config` 目录下创建 `mari_plugin.yml` 配置文件，初始值如下

```yaml
serverPort: 60721,
uidQuery: false,
enKaApi: https://enka.minigg.cn/
```

- serverPort: 插件所运行的端口，一般不用管，除非出现端口冲突
- uidQuery: 是否允许 `#panel` 与 `#panel_update` 使用 `uid` 查询/更新，为防止部分用户恶意遍历查询 uid，这里默认关闭，有需要的可以开启
- enKaApi: 面板数据来源地址，默认为 Enka 官方地址，可修改为 [@MiniGrayGay][2] 提供的国内反代地址以解决连接异常问题，详见配置文件中的 `tips`

修改 `mari_plugin.yml` 后重启 bot 或执行 Adachi-BOT 的 `refresh` 重载配置文件指令生效

![panel][3]

# 致谢

- [Enka.Network][4] - 提供panel数据来源
- [@MiniGrayGay][2] - 提供Enka反代地址

# 其他

logo来源：https://www.pixiv.net/artworks/63976809

[1]: https://github.com/SilveryStar/Adachi-BOT

[2]: https://github.com/MiniGrayGay

[3]: https://mari-plugin.oss-cn-beijing.aliyuncs.com/example/panel.png

[4]: https://enka.shinshin.moe/
