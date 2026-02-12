

本地nuxt项目架构：

```
bitfsae-nuxt/
├── app/                          # Nuxt 4 应用目录（前端代码）
│   ├── app.vue                   # 根组件
│   ├── app.config.ts             # 应用配置（UI 主题、Prose 组件样式）
│   ├── assets/styles/            # 样式文件
│   │   ├── ui.css                # Tailwind + Nuxt UI 入口
│   │   ├── variables.css         # CSS 变量（深色/浅色主题）
│   │   ├── global.css            # 全局样式（导航、页脚、动画等）
│   │   └── studio-light.css      # Nuxt Studio 编辑器浅色覆盖
│   ├── components/               # Vue 组件
│   │   ├── AppHeader.vue         # 顶部导航栏
│   │   ├── AppFooter.vue         # 页脚
│   │   ├── MobileMenu.vue        # 移动端侧滑菜单
│   │   ├── LoginModal.vue        # 遥测系统登录弹窗
│   │   ├── ScrollToTopButton.vue # 回到顶部按钮
│   │   └── content/              # MDC 内容组件（全局注册）
│   │       ├── Center.vue        # 居中对齐容器
│   │       ├── Left.vue          # 左对齐容器
│   │       ├── Right.vue         # 右对齐容器
│   │       ├── MSpan.vue         # 富文本 span（颜色/大小/预设）
│   │       ├── Span.vue          # 基础 span 透传
│   │       └── ImageGallery.vue  # 图片画廊网格
│   ├── composables/              # 可组合函数
│   │   ├── useCarousel.ts        # 轮播图逻辑
│   │   ├── useScrollAnimation.ts # 滚动入场动画
│   │   ├── useModalClickOutside.ts # 弹窗外部点击关闭
│   │   └── useTheme.ts           # 主题切换（未在组件中直接使用）
│   ├── layouts/
│   │   └── default.vue           # 默认布局（Header + Main + Footer）
│   ├── pages/                    # 页面路由
│   │   ├── index.vue             # 首页（轮播 + 赞助商）
│   │   ├── about.vue             # 关于我们
│   │   ├── events.vue            # 赛事介绍
│   │   ├── cars.vue              # 历代赛车
│   │   ├── sponsors.vue          # 赞助商
│   │   └── news/
│   │       ├── index.vue         # 新闻列表（搜索/筛选/分页）
│   │       └── [...slug].vue     # 新闻详情（MDC 渲染 + TOC）
│   ├── plugins/
│   │   └── seo.ts                # 全局 SEO meta 和结构化数据
│   ├── types/                    # TypeScript 类型定义
│   │   ├── index.ts              # 前端通用类型
│   │   ├── api.ts                # API 响应类型
│   │   └── content.ts            # Content 内容类型
│   └── utils/
│       └── data.ts               # 图片 URL 和轮播图配置
├── content/                      # Markdown 内容源
│   ├── cars/                     # 赛车数据
│   ├── events/                   # 赛事数据
│   └── news/                     # 新闻文章
├── i18n/locales/                 # 国际化翻译文件
│   ├── zh.json                   # 中文
│   └── en.json                   # 英文
├── public/                       # 静态资源
│   ├── assets/images/            # SVG 图标、Logo 等
│   ├── favicon.ico
│   └── sw.js                     # 占位 Service Worker
├── server/                       # 服务端 API
│   ├── api/
│   │   ├── news.ts               # 新闻列表 API（搜索/分页/全文检索）
│   │   ├── news/[slug].get.ts    # 新闻详情 API
│   │   ├── cars.ts               # 赛车列表 API
│   │   └── events.ts             # 赛事列表 API
│   └── tsconfig.json
├── content.config.ts             # Content Collections 定义
├── nuxt.config.ts                # Nuxt 核心配置
├── tailwind.config.ts            # Tailwind 配置（typography 插件）
├── tsconfig.json                 # TypeScript 配置
└── package.json                  # 依赖和脚本
```


北京理工大学纯电动方程式赛车队网站
- 网站: https://bitfsae.xin/
服务器： 阿里云2核2G。
宿主机 Nginx + PM2 运行 Nuxt,在宿主机安装 Node.js、PM2 和 Nginx

## 2. Docker Compose 配置 (docker-compose.yml)

```yaml
services:
  # 1. MQTT Broker
  mosquitto:
    image: eclipse-mosquitto
    container_name: fsae_mosquitto
    ports:
      - "1883:1883"
      - "9001:9001"
    volumes:
      - ./mosquitto/config/mosquitto.conf:/mosquitto/config/mosquitto.conf
      - ./mosquitto/data:/mosquitto/data
      - ./mosquitto/log:/mosquitto/log
    restart: always

  # 2. InfluxDB 1.8
  influxdb:
    image: influxdb:1.8
    container_name: fsae_influxdb
    ports:
      - "8086:8086"
    volumes:
      - ./influxdb_1.8_data:/var/lib/influxdb
    environment:
      - INFLUXDB_DB=fsae_db
    restart: always

  # 3. Telegraf
  telegraf:
    image: telegraf
    container_name: fsae_telegraf
    volumes:
      # 配置文件挂载
      - ./telegraf/telegraf.conf:/etc/telegraf/telegraf.conf:ro
      # Protos 定义文件挂载 (只保留这一行正确的相对路径即可)
      - ./protos:/etc/telegraf/protos:ro
    depends_on:
      - influxdb
      - mosquitto
    restart: always

  # 4. Grafana
  grafana:
    image: grafana/grafana
    container_name: fsae_grafana
    ports:
      - "127.0.0.1:3001:3000"
    environment:
      - GF_DASHBOARDS_MIN_REFRESH_INTERVAL=200ms
      - GF_SERVER_DOMAIN=bitfsae.xin
      - GF_SERVER_ROOT_URL=https://bitfsae.xin/monitor/
      - GF_SERVER_SERVE_FROM_SUB_PATH=true
    volumes:
      - ./grafana_data:/var/lib/grafana
    restart: always


```

---

## 3. Mosquitto MQTT Broker 配置 (mosquitto/config/mosquitto.conf)

```conf
persistence true
persistence_location /mosquitto/data/
log_dest file /mosquitto/log/mosquitto.log

# 允许匿名访问(方便初期调试)
allow_anonymous true

# 监听 1883 端口 (用于手机/车侧发送数据)
listener 1883
protocol mqtt

# 监听 9001 端口 (用于网页端 WebSocket 连接)
listener 9001
protocol websockets
```

---

## 4. Nginx Web 服务器配置 (nginx/conf.d/default.conf)

```nginx
# 1. 强制 HTTP 跳转到 HTTPS (可选，为了安全)
server {
    listen 80;
    server_name bitfsae.xin www.bitfsae.xin;
    # 把所有 HTTP 请求重定向到 HTTPS
    return 301 https://$host$request_uri;
}

# 2. HTTPS 配置
server {
    listen 443 ssl;
    server_name bitfsae.xin www.bitfsae.xin;

    # SSL 证书路径 (这是 Docker 内部的路径，稍后会在 docker-compose 映射)
    ssl_certificate /etc/nginx/cert/bitfsae.xin.pem;
    ssl_certificate_key /etc/nginx/cert/bitfsae.xin.key;

    # SSL 优化配置 (推荐配置)
    ssl_session_timeout 5m;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:HIGH:!aNULL:!MD5:!RC4:!DHE;
    ssl_prefer_server_ciphers on;

    gzip on;
    gzip_min_length 1k; # 小于1k的文件不压缩
    gzip_comp_level 6;  # 压缩级别 1-9，6是平衡点
    gzip_types text/plain text/css text/javascript application/json application/javascript application/x-javascript application/xml image/svg+xml;
    gzip_vary on;       

    # 网页根目录
    location / {
        root /usr/share/nginx/html;
        index index.html;
        # SPA 路由核心配置:找不到文件时回退到 index.html
        try_files $uri $uri/ /index.html;
    }   
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        root /usr/share/nginx/html; # 明确指定 root，防止路径混淆
        expires 1y;
        add_header Cache-Control "public, no-transform";
        access_log off;
    }
    # 强制 index.html 不缓存
    # 确保用户每次刷新都能获取最新的发布版本
    location = /index.html {
        root /usr/share/nginx/html;
        add_header Cache-Control "no-cache, no-store, must-revalidate";
        expires 0;
    }

    # Grafana 反向代理配置
    location ^~ /monitor/ {
        # 这里的 fsae_grafana 是 docker-compose 里的容器名
        proxy_pass http://fsae_grafana:3000;

        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # 支持 WebSocket (Grafana Live 实时刷新需要)
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
```

---

## 5. Telegraf 数据收集器配置 (telegraf/telegraf.conf)

```toml
[agent]
  interval = "100ms"
  round_interval = true
  metric_batch_size = 1000
  metric_buffer_limit = 10000
  collection_jitter = "0s"
  flush_interval = "1s"
  flush_jitter = "0s"
  hostname = "fsae-server"

[[inputs.mqtt_consumer]]
  servers = ["tcp://mosquitto:1883"]
  topics  = ["fsae/telemetry"]

  data_format = "xpath_protobuf"
  xpath_protobuf_import_paths = ["/etc/telegraf/protos"]
  xpath_protobuf_file = "fsae_telemetry.proto"
  xpath_protobuf_type = "fsae.TelemetryFrame"

  [[inputs.mqtt_consumer.xpath]]
    metric_name = "'telemetry'"
    # --- int 类型(必须用 fields_int)---
    [inputs.mqtt_consumer.xpath.fields_int]
      timestamp_ms = "//timestamp_ms"
      frame_id     = "//frame_id"
      fault_code   = "//fault_code"
      motor_rpm    = "//motor_rpm"
      ready_to_drive = "//ready_to_drive"
      vcu_status     = "//vcu_status"
    # --- float / bool 类型(用 number() 或比较表达式)---
    [inputs.mqtt_consumer.xpath.fields]
      apps_position    = "number(//apps_position)"
      brake_pressure   = "number(//brake_pressure)"
      steering_angle   = "number(//steering_angle)"
      hv_voltage       = "number(//hv_voltage)"
      hv_current       = "number(//hv_current)"
      battery_temp_max = "number(//battery_temp_max)"
      motor_temp       = "number(//motor_temp)"
      inverter_temp    = "number(//inverter_temp)"

[[inputs.mqtt_consumer]]
  servers = ["tcp://mosquitto:1883"]
  topics = ["fsae/bms"]
  data_format = "xpath_protobuf"
  xpath_protobuf_file = "fsae_telemetry.proto"
  xpath_protobuf_import_paths = ["/etc/telegraf/protos"]
  xpath_protobuf_type = "fsae.TelemetryFrame"

  [[inputs.mqtt_consumer.xpath]]
    metric_name = "'bms_data'"
    metric_selection = "//modules" 
    
    [inputs.mqtt_consumer.xpath.tags]
      module_id = "module_id"
    # 映射所有电芯电压 (v_01 ~ v_23) 和 温度 (t_1 ~ t_8)
    [inputs.mqtt_consumer.xpath.fields_int]
      v_01 = "v01"
      v_02 = "v02"
      v_03 = "v03"
      v_04 = "v04"
      v_05 = "v05"
      v_06 = "v06"
      v_07 = "v07"
      v_08 = "v08"
      v_09 = "v09"
      v_10 = "v10"
      v_11 = "v11"
      v_12 = "v12"
      v_13 = "v13"
      v_14 = "v14"
      v_15 = "v15"
      v_16 = "v16"
      v_17 = "v17"
      v_18 = "v18"
      v_19 = "v19"
      v_20 = "v20"
      v_21 = "v21"
      v_22 = "v22"
      v_23 = "v23"

      t_1 = "t1"
      t_2 = "t2"
      t_3 = "t3"
      t_4 = "t4"
      t_5 = "t5"
      t_6 = "t6"
      t_7 = "t7"
      t_8 = "t8"

[[outputs.influxdb]]
  urls = ["http://influxdb:8086"]
  database = "fsae_db"
  skip_database_creation = false
```

---

## 6. Protocol Buffers 数据定义 (protos/fsae_telemetry.proto)

```protobuf
syntax = "proto3";
package fsae;

message BatteryModule {
    uint32 module_id = 1;
    // 23 节电芯电压
    uint32 v01 = 2;
    uint32 v02 = 3;
    uint32 v03 = 4;
    uint32 v04 = 5;
    uint32 v05 = 6;
    uint32 v06 = 7;
    uint32 v07 = 8;
    uint32 v08 = 9;
    uint32 v09 = 10;
    uint32 v10 = 11;
    uint32 v11 = 12;
    uint32 v12 = 13;
    uint32 v13 = 14;
    uint32 v14 = 15;
    uint32 v15 = 16;
    uint32 v16 = 17;
    uint32 v17 = 18;
    uint32 v18 = 19;
    uint32 v19 = 20;
    uint32 v20 = 21;
    uint32 v21 = 22;
    uint32 v22 = 23;
    uint32 v23 = 24;

    // 8 个温度
    sint32 t1 = 30;
    sint32 t2 = 31;
    sint32 t3 = 32;
    sint32 t4 = 33;
    sint32 t5 = 34;
    sint32 t6 = 35;
    sint32 t7 = 36;
    sint32 t8 = 37;
}

message TelemetryFrame {
    // --- 1. 基础信息 ---
    uint32 timestamp_ms = 1;
    uint32 frame_id = 2;
    
    // --- 2. 驾驶员输入 ---
    float apps_position = 3;
    float brake_pressure = 4;
    float steering_angle = 5;

    // --- 3. 高压系统 ---
    float hv_voltage = 6;
    float hv_current = 7;
    float battery_temp_max = 8;
    uint32 fault_code = 9;

    // --- 4. 动力系统 ---
    int32 motor_rpm = 10;
    float motor_temp = 11;
    float inverter_temp = 12;
    
    // --- 5. 车辆状态 (改为整数:0=Off, 1=On) ---
    uint32 ready_to_drive = 13;
    uint32 vcu_status = 14;
    
    // --- 6. BMS 详细数据
    repeated BatteryModule modules = 15;
}
```

---

## 7. Protobuf 选项配置 (protos/fsae_telemetry.options)

```
fsae.TelemetryFrame.modules    max_count:6
```

---

