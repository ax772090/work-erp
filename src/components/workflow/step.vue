<template>
  <div
    class="el-step"
    :style="style"
    :class="[
      !isSimple && `is-${$parent.direction}`,
      isSimple && 'is-simple',
      isLast && !space && !isCenter && 'is-flex',
      isCenter && !isVertical && !isSimple && 'is-center'
     ]">
    <!-- icon & line -->
    <div
      class="el-step__head"
      :class="`is-${currentStatus}`">
      <div
        class="el-step__line"
        :style="isLast ? '' : { marginRight: $parent.stepOffset + 'px' }"
      >
        <i class="el-step__line-inner" :style="lineStyle"></i>
      </div>

      <div class="el-step__icon" :class="`is-${icon ? 'icon' : 'text'}`">
        <slot
          v-if="currentStatus !== 'success' && currentStatus !== 'error'"
          name="icon">
          <i v-if="icon" class="el-step__icon-inner" :class="[icon]"></i>
          <div class="el-step__icon-inner" v-if="!icon && !isSimple">{{ index + 1 }}</div>
        </slot>
        <i
          v-else
          :class="['el-icon-' + (currentStatus === 'success' ? 'check' : 'close')]"
          class="el-step__icon-inner is-status"
        >
        </i>
      </div>
    </div>
    <!-- title & description -->
    <div class="el-step__main">
      <div
        class="el-step__title"
        ref="title"
        :class="['is-' + currentStatus]">
        <slot name="title">{{ title }}</slot>
        <!-- 添加自定义审核动作 -->
        <span
            class="el-step__action-self"
            ref="title">
            <slot name="action">{{action}}</slot>
        </span>
        <!-- 添加自定义审核时间 -->
        <span
            class="el-step__time-self"
            ref="title">
            <slot name="time">{{time}}</slot>
        </span>
      </div>

      <div v-if="isSimple" class="el-step__arrow"></div>
      <div
        v-else
        class="el-step__description"
        :class="['is-' + currentStatus]">
        <slot name="description">{{ description }}</slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ElStep',

  props: {
    title: String,
    icon: String,
    description: String,
    status: String,
    action: String,
    time: String
  },

  data() {
    return {
      index: -1,
      lineStyle: {},
      internalStatus: ''
    };
  },

  beforeCreate() {
    this.$parent.steps.push(this);
  },

  beforeDestroy() {
    const steps = this.$parent.steps;
    const index = steps.indexOf(this);
    if (index >= 0) {
      steps.splice(index, 1);
    }
  },

  computed: {
    currentStatus() {
      return this.status || this.internalStatus;
    },
    prevStatus() {
      const prevStep = this.$parent.steps[this.index - 1];
      return prevStep ? prevStep.currentStatus : 'wait';
    },
    isCenter() {
      return this.$parent.alignCenter;
    },
    isVertical() {
      return this.$parent.direction === 'vertical';
    },
    isSimple() {
      return this.$parent.simple;
    },
    isLast() {
      const parent = this.$parent;
      return parent.steps[parent.steps.length - 1] === this;
    },
    stepsCount() {
      return this.$parent.steps.length;
    },
    space() {
      const { isSimple, $parent: { space } } = this;
      return isSimple ? '' : space ;
    },
    style: function() {
      const style = {};
      const parent = this.$parent;
      const len = parent.steps.length;

      const space = (typeof this.space === 'number'
        ? this.space + 'px'
        : this.space
          ? this.space
          : 100 / (len - (this.isCenter ? 0 : 1)) + '%');
      style.flexBasis = space;
      if (this.isVertical) return style;
      if (this.isLast) {
        style.maxWidth = 100 / this.stepsCount + '%';
      } else {
        style.marginRight = -this.$parent.stepOffset + 'px';
      }

      return style;
    }
  },

  methods: {
    updateStatus(val) {
      const prevChild = this.$parent.$children[this.index - 1];

      if (val > this.index) {
        this.internalStatus = this.$parent.finishStatus;
      } else if (val === this.index && this.prevStatus !== 'error') {
        this.internalStatus = this.$parent.processStatus;
      } else {
        this.internalStatus = 'wait';
      }

      if (prevChild) prevChild.calcProgress(this.internalStatus);
    },

    calcProgress(status) {
      let step = 100;
      const style = {};

      style.transitionDelay = 150 * this.index + 'ms';
      if (status === this.$parent.processStatus) {
        step = this.currentStatus !== 'error' ? 0 : 0;
      } else if (status === 'wait') {
        step = 0;
        style.transitionDelay = (-150 * this.index) + 'ms';
      }

      style.borderWidth = step ? '1px' : 0;
      this.$parent.direction === 'vertical'
        ? style.height = step + '%'
        : style.width = step + '%';

      this.lineStyle = style;
    }
  },

  mounted() {
    const unwatch = this.$watch('index', val => {
      this.$watch('$parent.active', this.updateStatus, { immediate: true });
      unwatch();
    });
  }
};
</script>
<style scoped>
.el-step__action-self{
    margin-left: 20px;
}
.el-step__time-self{
    float:right;
    color: darkgray;
}
</style>

