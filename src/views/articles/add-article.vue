<template>
  <div class="article-add">
    <el-card
      ><template v-slot:header>
        <my-breadcrumb>发布文章</my-breadcrumb>
      </template>
      <el-form
        hide-required-asterisk
        ref="myform"
        :model="form"
        :rules="rules"
        label-width="40px"
      >
        <el-form-item label="标题" prop="title">
          <el-input v-model="form.title" placeholder="请输入标题"></el-input>
        </el-form-item>
        <el-form-item label="内容" prop="content">
          <quill-editor
            v-model="form.content"
            :options="editorOption"
            @blur="quillFn"
            @change="quillFn"
            >
          </quill-editor>
        </el-form-item>
        <el-form-item label="封面">
          <el-radio-group @change="changeType" v-model="form.cover.type">
            <el-radio :label="1">单图</el-radio>
            <el-radio :label="3">三图</el-radio>
            <el-radio :label="0">无图</el-radio>
            <el-radio :label="-1">自动</el-radio>
          </el-radio-group>
          <div
            class="cover-box"
            v-if="form.cover.type > 0"
            :key="form.cover.type"
          >
            <my-cover
              v-model="form.cover.images[index]"
              v-for="(item, index) in form.cover.type"
              :key="item"
            ></my-cover>
          </div>
          <div
            class="cover-box"
            v-if="form.cover.type === -1"
            :key="form.cover.type"
          >
            <my-cover
              v-model="form.cover.images[index]"
              v-for="(item, index) in form.cover.images.length + 1"
              :key="item"
            ></my-cover>
          </div>
        </el-form-item>

        <el-form-item label="频道" prop="channel_id">
          <my-channels v-model="form.channel_id"></my-channels>
        </el-form-item>
        <el-form-item>
          <el-button @click="clickAddArticle(false)" type="primary"
            >发表</el-button
          >
          <el-button @click="clickAddArticle(true)">存入草稿</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import MyBreadcrumb from '@/components/my-breadcrumb'
import MyChannels from '@/components/my-channels.vue'
import MyCover from '@/components/my-cover.vue'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import { quillEditor } from 'vue-quill-editor'
import { reqAddArticles } from '@/api/articles.js'

export default {
  name: 'AddArticle',
  components: {
    MyBreadcrumb,
    quillEditor,
    MyChannels,
    MyCover
  },
  data () {
    return {
      form: {
        title: '',
        content: '',
        channel_id: null,
        cover: {
          type: 0,
          images: []
        }
      },
      rules: {
        title: [
          { required: true, message: '标题不能为空', trigger: ['blur', 'change'] },
          {
            min: 5,
            max: 20,
            message: '文章标题必须是5-20个字符',
            trigger: ['blur', 'change']
          }
        ],
        content: [
          { required: true, message: '请输入文章内容', trigger: ['blur', 'change'] }
        ],
        channel_id: [
          {
            required: true,
            message: '频道不能为空',
            trigger: ['blur', 'change']
          }
        ]
      },
      editorOption: {
        // 这里就是定制的富文本编辑器的内容
        modules: {
          // 对于工具栏的配置
          toolbar: [
            ['bold', 'italic', 'underline', 'strike'],
            ['blockquote', 'code-block'],
            [{ header: 1 }, { header: 2 }],
            [{ list: 'ordered' }, { list: 'bullet' }],
            [{ indent: '-1' }, { indent: '+1' }],
            ['image']
          ]
        }
      }
    }
  },
  methods: {
    clickAddArticle (dreaf) {
      this.$refs.myform.validate(async (flag) => {
        if (!flag) return
        try {
          await reqAddArticles(dreaf, this.form)
          this.$message.success('发布成功')
          this.$router.push('/articles')
        } catch {
          this.$message.error('发布失败')
        }
      })
    },
    quillFn () {
      this.$refs.myform.validateField('content')
    },
    changeType () {
      this.form.cover.images = []
    }
  }

}
</script>

<style lang="less" scoped>
.article-add {
  /deep/ .ql-editor {
    min-height: 300px;
  }
  /deep/ .ql-toolbar.ql-snow {
    padding: 2px;
  }
  .cover-box {
    display: flex;
    .my-cover {
      margin-right: 20px;
    }
  }
}

</style>
