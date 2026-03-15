<script setup lang="ts">
definePageMeta({ layout: false })

// ─── Auth guard ──────────────────────────────────────────────────────────────
const adminToken = useCookie('admin_token')
onMounted(() => {
  if (!adminToken.value) {
    navigateTo('/admin')
  }
})

// ─── Section tabs ─────────────────────────────────────────────────────────────
type Section = 'hero' | 'navbar' | 'about' | 'projects' | 'blog' | 'footer'
const activeSection = ref<Section>('hero')

const sectionMeta: { key: Section; label: string; icon: string }[] = [
  { key: 'hero', label: 'Hero', icon: 'home' },
  { key: 'navbar', label: 'Navbar', icon: 'menu' },
  { key: 'about', label: 'About', icon: 'user' },
  { key: 'projects', label: 'Projects', icon: 'briefcase' },
  { key: 'blog', label: 'Blog', icon: 'pen-tool' },
  { key: 'footer', label: 'Footer', icon: 'mail' },
]

// ─── Toast ────────────────────────────────────────────────────────────────────
const toast = ref<{ message: string; type: 'success' | 'error' } | null>(null)
let toastTimer: ReturnType<typeof setTimeout>

function showToast(message: string, type: 'success' | 'error') {
  toast.value = { message, type }
  clearTimeout(toastTimer)
  toastTimer = setTimeout(() => { toast.value = null }, 3000)
}

// ─── Dirty tracking ───────────────────────────────────────────────────────────
const isDirty = ref(false)

// ─── Hero form ────────────────────────────────────────────────────────────────
interface Stat { value: number; suffix: string; label: string }
interface TechPill { label: string; color: string }
interface Cta { label: string; href: string }
interface SocialLink { label: string; href: string }

const hero = ref({
  badge: '',
  name1: '',
  name2: '',
  availableForWork: true,
  subtitle: '',
  roles: [] as string[],
  stats: [] as Stat[],
  techPills: [] as TechPill[],
  ctaPrimary: { label: '', href: '' } as Cta,
  ctaSecondary: { label: '', href: '' } as Cta,
  socialLinks: [] as SocialLink[],
})

// ─── Navbar form ──────────────────────────────────────────────────────────────
interface NavLink { label: string; href: string }

const navbar = ref({
  logoText: '',
  links: [] as NavLink[],
})

// ─── About form ───────────────────────────────────────────────────────────────
interface QuickFact { label: string; value: string; highlight?: boolean }
interface JourneyItem { period: string; role: string; company: string; description: string }
interface PhilosophyItem { icon: string; title: string; text: string }

const about = ref({
  badge: '',
  heading1: '',
  heading2: '',
  avatarText: '',
  introHeading: '',
  bio: [] as string[],
  quickFacts: [] as QuickFact[],
  journey: [] as JourneyItem[],
  philosophy: [] as PhilosophyItem[],
})

// ─── Projects form ────────────────────────────────────────────────────────────
interface Project {
  name: string; url: string; role: string; description: string
  tech: string[]; color: string; year: string; logo: string; category: string
}
interface ProjectStat { value: string; label: string }

const projects = ref({
  badge: '',
  heading1: '',
  heading2: '',
  subtitle: '',
  projects: [] as Project[],
  stats: [] as ProjectStat[],
  ctaLabel: '',
  ctaHref: '',
})

// ─── Blog form ────────────────────────────────────────────────────────────────
interface Article {
  title: string; excerpt: string; date: string; readTime: string
  tags: string[]; slug: string; featured: boolean
}

const blog = ref({
  badge: '',
  heading1: '',
  heading2: '',
  subtitle: '',
  articles: [] as Article[],
})

// ─── Footer form ──────────────────────────────────────────────────────────────
interface FooterSocialLink { label: string; href: string; icon: string }
interface FooterNavLink { label: string; href: string }

const footer = ref({
  heading: '',
  subheading: '',
  email: '',
  socialLinks: [] as FooterSocialLink[],
  navLinks: [] as FooterNavLink[],
  copyright: '',
  tagline: '',
})

// ─── Load / Save ──────────────────────────────────────────────────────────────
const loading = ref(false)
const saving = ref(false)

async function loadSection(section: Section) {
  loading.value = true
  isDirty.value = false
  try {
    const data = await $fetch<any>(`/api/admin/content/${section}`)
    if (section === 'hero') {
      hero.value = {
        badge: data.badge ?? '',
        name1: data.name1 ?? '',
        name2: data.name2 ?? '',
        availableForWork: data.availableForWork ?? true,
        subtitle: data.subtitle ?? '',
        roles: Array.isArray(data.roles) ? [...data.roles] : [],
        stats: Array.isArray(data.stats) ? data.stats.map((s: any) => ({ ...s })) : [],
        techPills: Array.isArray(data.techPills) ? data.techPills.map((p: any) => ({ ...p })) : [],
        ctaPrimary: { label: data.ctaPrimary?.label ?? '', href: data.ctaPrimary?.href ?? '' },
        ctaSecondary: { label: data.ctaSecondary?.label ?? '', href: data.ctaSecondary?.href ?? '' },
        socialLinks: Array.isArray(data.socialLinks) ? data.socialLinks.map((l: any) => ({ ...l })) : [],
      }
    } else if (section === 'navbar') {
      navbar.value = {
        logoText: data.logoText ?? '',
        links: Array.isArray(data.links) ? data.links.map((l: any) => ({ ...l })) : [],
      }
    } else if (section === 'about') {
      about.value = {
        badge: data.badge ?? '',
        heading1: data.heading1 ?? '',
        heading2: data.heading2 ?? '',
        avatarText: data.avatarText ?? '',
        introHeading: data.introHeading ?? '',
        bio: Array.isArray(data.bio) ? [...data.bio] : [],
        quickFacts: Array.isArray(data.quickFacts) ? data.quickFacts.map((f: any) => ({ ...f })) : [],
        journey: Array.isArray(data.journey) ? data.journey.map((j: any) => ({ ...j })) : [],
        philosophy: Array.isArray(data.philosophy) ? data.philosophy.map((p: any) => ({ ...p })) : [],
      }
    } else if (section === 'projects') {
      projects.value = {
        badge: data.badge ?? '',
        heading1: data.heading1 ?? '',
        heading2: data.heading2 ?? '',
        subtitle: data.subtitle ?? '',
        projects: Array.isArray(data.projects) ? data.projects.map((p: any) => ({
          ...p,
          tech: Array.isArray(p.tech) ? [...p.tech] : [],
        })) : [],
        stats: Array.isArray(data.stats) ? data.stats.map((s: any) => ({ ...s })) : [],
        ctaLabel: data.ctaLabel ?? '',
        ctaHref: data.ctaHref ?? '',
      }
    } else if (section === 'blog') {
      blog.value = {
        badge: data.badge ?? '',
        heading1: data.heading1 ?? '',
        heading2: data.heading2 ?? '',
        subtitle: data.subtitle ?? '',
        articles: Array.isArray(data.articles) ? data.articles.map((a: any) => ({
          ...a,
          tags: Array.isArray(a.tags) ? [...a.tags] : [],
        })) : [],
      }
    } else if (section === 'footer') {
      footer.value = {
        heading: data.heading ?? '',
        subheading: data.subheading ?? '',
        email: data.email ?? '',
        socialLinks: Array.isArray(data.socialLinks) ? data.socialLinks.map((l: any) => ({ ...l })) : [],
        navLinks: Array.isArray(data.navLinks) ? data.navLinks.map((l: any) => ({ ...l })) : [],
        copyright: data.copyright ?? '',
        tagline: data.tagline ?? '',
      }
    }
  } catch {
    showToast('Failed to load content', 'error')
  } finally {
    loading.value = false
  }
}

function getSectionData(section: Section) {
  const map: Record<Section, any> = {
    hero: hero.value,
    navbar: navbar.value,
    about: about.value,
    projects: projects.value,
    blog: blog.value,
    footer: footer.value,
  }
  return map[section]
}

async function saveSection() {
  saving.value = true
  try {
    await $fetch(`/api/admin/content/${activeSection.value}`, { method: 'PUT', body: getSectionData(activeSection.value) })
    isDirty.value = false
    showToast('Changes saved successfully', 'success')
  } catch {
    showToast('Failed to save changes', 'error')
  } finally {
    saving.value = false
  }
}

async function switchSection(section: Section) {
  activeSection.value = section
  await loadSection(section)
}

function markDirty() {
  isDirty.value = true
}

async function logout() {
  await $fetch('/api/admin/logout', { method: 'POST' })
  navigateTo('/admin')
}

onMounted(async () => {
  await loadSection('hero')
})

// ─── Dynamic list helpers ─────────────────────────────────────────────────────
function addRole() { hero.value.roles.push(''); markDirty() }
function removeRole(i: number) { hero.value.roles.splice(i, 1); markDirty() }
function addStat() { hero.value.stats.push({ value: 0, suffix: '+', label: '' }); markDirty() }
function removeStat(i: number) { hero.value.stats.splice(i, 1); markDirty() }
function addTechPill() { hero.value.techPills.push({ label: '', color: '#ffffff' }); markDirty() }
function removeTechPill(i: number) { hero.value.techPills.splice(i, 1); markDirty() }
function addSocialLink() { hero.value.socialLinks.push({ label: '', href: '' }); markDirty() }
function removeSocialLink(i: number) { hero.value.socialLinks.splice(i, 1); markDirty() }
function addNavLink() { navbar.value.links.push({ label: '', href: '' }); markDirty() }
function removeNavLink(i: number) { navbar.value.links.splice(i, 1); markDirty() }

// About helpers
function addBioParagraph() { about.value.bio.push(''); markDirty() }
function removeBioParagraph(i: number) { about.value.bio.splice(i, 1); markDirty() }
function addQuickFact() { about.value.quickFacts.push({ label: '', value: '', highlight: false }); markDirty() }
function removeQuickFact(i: number) { about.value.quickFacts.splice(i, 1); markDirty() }
function addJourneyItem() { about.value.journey.push({ period: '', role: '', company: '', description: '' }); markDirty() }
function removeJourneyItem(i: number) { about.value.journey.splice(i, 1); markDirty() }
function addPhilosophyItem() { about.value.philosophy.push({ icon: '', title: '', text: '' }); markDirty() }
function removePhilosophyItem(i: number) { about.value.philosophy.splice(i, 1); markDirty() }

// Projects helpers
function addProject() {
  projects.value.projects.push({ name: '', url: '', role: '', description: '', tech: [], color: '#000000', year: '', logo: '', category: '' })
  markDirty()
}
function removeProject(i: number) { projects.value.projects.splice(i, 1); markDirty() }
function addProjectTech(pi: number) { projects.value.projects[pi].tech.push(''); markDirty() }
function removeProjectTech(pi: number, ti: number) { projects.value.projects[pi].tech.splice(ti, 1); markDirty() }
function addProjectStat() { projects.value.stats.push({ value: '', label: '' }); markDirty() }
function removeProjectStat(i: number) { projects.value.stats.splice(i, 1); markDirty() }

// Blog helpers
function addArticle() {
  blog.value.articles.push({ title: '', excerpt: '', date: '', readTime: '', tags: [], slug: '', featured: false })
  markDirty()
}
function removeArticle(i: number) { blog.value.articles.splice(i, 1); markDirty() }
function addArticleTag(ai: number) { blog.value.articles[ai].tags.push(''); markDirty() }
function removeArticleTag(ai: number, ti: number) { blog.value.articles[ai].tags.splice(ti, 1); markDirty() }

// Footer helpers
function addFooterSocial() { footer.value.socialLinks.push({ label: '', href: '', icon: '' }); markDirty() }
function removeFooterSocial(i: number) { footer.value.socialLinks.splice(i, 1); markDirty() }
function addFooterNav() { footer.value.navLinks.push({ label: '', href: '' }); markDirty() }
function removeFooterNav(i: number) { footer.value.navLinks.splice(i, 1); markDirty() }

// SVG icon paths for sidebar
const iconPaths: Record<string, string> = {
  home: 'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z M9 22V12h6v10',
  menu: 'M3 6h18 M3 12h18 M3 18h18',
  user: 'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2 M12 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8z',
  briefcase: 'M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16 M1 9h22v10a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V9z',
  'pen-tool': 'M12 19l7-7 3 3-7 7-3-3z M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z M2 2l7.586 7.586 M11 13a2 2 0 1 0 0-4 2 2 0 0 0 0 4z',
  mail: 'M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z M22 6l-10 7L2 6',
}
</script>

<template>
  <div
    class="flex min-h-screen"
    style="background: #0f0f0f; font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; color: #f5f5f7;"
  >
    <!-- ── Sidebar ─────────────────────────────────────────────────────────── -->
    <aside
      class="fixed top-0 left-0 h-full flex flex-col"
      style="width: 240px; background: #111111; border-right: 1px solid #2d2d2f; z-index: 10;"
    >
      <!-- Logo -->
      <div class="flex items-center gap-2.5 px-5 py-5" style="border-bottom: 1px solid #2d2d2f;">
        <div
          class="w-8 h-8 rounded-lg flex items-center justify-center text-[13px] font-semibold"
          style="background: #0071e3; color: white;"
        >
          ⚙
        </div>
        <span class="text-[15px] font-semibold" style="color: #f5f5f7;">Admin</span>
      </div>

      <!-- View Site -->
      <div class="px-3 pt-4">
        <NuxtLink
          to="/"
          class="flex items-center gap-2 px-3 py-2 rounded-lg text-[13px] transition-colors duration-150"
          style="color: #86868b;"
          @mouseover="(e) => (e.currentTarget as HTMLElement).style.background = '#1a1a1a'"
          @mouseleave="(e) => (e.currentTarget as HTMLElement).style.background = 'transparent'"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          View Site
        </NuxtLink>
      </div>

      <!-- Section list -->
      <nav class="flex flex-col gap-1 px-3 pt-3">
        <p class="px-3 pb-1 text-[11px] font-medium uppercase tracking-wider" style="color: #6e6e73;">
          Sections
        </p>

        <button
          v-for="sec in sectionMeta"
          :key="sec.key"
          class="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-[13px] font-medium text-left transition-all duration-150 w-full"
          :style="activeSection === sec.key ? 'background: rgba(0,113,227,0.15); color: #0071e3;' : 'color: #86868b;'"
          @click="switchSection(sec.key)"
          @mouseover="(e) => { if (activeSection !== sec.key) (e.currentTarget as HTMLElement).style.background = '#1a1a1a' }"
          @mouseleave="(e) => { if (activeSection !== sec.key) (e.currentTarget as HTMLElement).style.background = 'transparent' }"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path :d="iconPaths[sec.icon]" />
          </svg>
          {{ sec.label }}
        </button>
      </nav>

      <!-- Spacer -->
      <div class="flex-1" />

      <!-- Logout -->
      <div class="p-3" style="border-top: 1px solid #2d2d2f;">
        <button
          class="flex items-center gap-2 w-full px-3 py-2.5 rounded-lg text-[13px] transition-all duration-150"
          style="color: #ff453a;"
          @click="logout"
          @mouseover="(e) => (e.currentTarget as HTMLElement).style.background = 'rgba(255, 69, 58, 0.1)'"
          @mouseleave="(e) => (e.currentTarget as HTMLElement).style.background = 'transparent'"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
            <polyline points="16 17 21 12 16 7"/>
            <line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
          Logout
        </button>
      </div>
    </aside>

    <!-- ── Main content ────────────────────────────────────────────────────── -->
    <main class="flex-1" style="margin-left: 240px; min-height: 100vh;">

      <!-- Header -->
      <div
        class="sticky top-0 z-10 flex items-center justify-between px-8 py-4"
        style="background: #0f0f0f; border-bottom: 1px solid #2d2d2f;"
      >
        <div class="flex items-center gap-2 text-[14px]">
          <span style="color: #6e6e73;">Dashboard</span>
          <span style="color: #3a3a3c;">›</span>
          <span style="color: #f5f5f7;" class="font-medium capitalize">{{ activeSection }}</span>
          <span
            v-if="isDirty"
            class="ml-2 px-2 py-0.5 rounded-full text-[11px] font-medium"
            style="background: rgba(255, 159, 10, 0.15); color: #ff9f0a; border: 1px solid rgba(255, 159, 10, 0.3);"
          >
            Unsaved changes
          </span>
        </div>

        <button
          :disabled="saving || loading"
          class="flex items-center gap-2 px-4 py-2 rounded-lg text-[13px] font-medium text-white transition-all duration-150"
          style="background: #0071e3;"
          :style="saving || loading ? 'opacity: 0.5; cursor: not-allowed;' : 'cursor: pointer;'"
          @click="saveSection"
          @mouseover="(e) => { if (!saving && !loading) (e.currentTarget as HTMLElement).style.background = '#0077ed' }"
          @mouseleave="(e) => (e.currentTarget as HTMLElement).style.background = '#0071e3'"
        >
          <svg v-if="saving" class="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" stroke-dasharray="32" stroke-dashoffset="12" />
          </svg>
          <svg v-else width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
            <polyline points="17 21 17 13 7 13 7 21"/>
            <polyline points="7 3 7 8 15 8"/>
          </svg>
          {{ saving ? 'Saving...' : 'Save Changes' }}
        </button>
      </div>

      <!-- Loading state -->
      <div v-if="loading" class="flex items-center justify-center h-64">
        <div class="flex flex-col items-center gap-3">
          <svg class="animate-spin" width="24" height="24" viewBox="0 0 24 24" fill="none" style="color: #0071e3;">
            <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" stroke-dasharray="32" stroke-dashoffset="12" />
          </svg>
          <span class="text-[13px]" style="color: #6e6e73;">Loading content...</span>
        </div>
      </div>

      <!-- ── Hero Editor ──────────────────────────────────────────────────── -->
      <div v-else-if="activeSection === 'hero'" class="p-8 flex flex-col gap-6">
        <!-- Basic Info -->
        <div class="rounded-xl p-6" style="background: #1a1a1a; border: 1px solid #2d2d2f;">
          <h2 class="text-[15px] font-semibold mb-5" style="color: #f5f5f7;">Basic Info</h2>
          <div class="grid grid-cols-1 gap-4">
            <div class="flex flex-col gap-1.5">
              <label class="text-[12px] font-medium uppercase tracking-wider" style="color: #86868b;">Badge Text</label>
              <input v-model="hero.badge" type="text" class="admin-input" @input="markDirty" />
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div class="flex flex-col gap-1.5">
                <label class="text-[12px] font-medium uppercase tracking-wider" style="color: #86868b;">Name Line 1</label>
                <input v-model="hero.name1" type="text" class="admin-input" @input="markDirty" />
              </div>
              <div class="flex flex-col gap-1.5">
                <label class="text-[12px] font-medium uppercase tracking-wider" style="color: #86868b;">Name Line 2</label>
                <input v-model="hero.name2" type="text" class="admin-input" @input="markDirty" />
              </div>
            </div>
            <div class="flex items-center justify-between py-1">
              <div>
                <p class="text-[14px] font-medium" style="color: #f5f5f7;">Available for Work</p>
                <p class="text-[12px]" style="color: #86868b;">Shows the green dot status badge</p>
              </div>
              <button
                class="relative inline-flex items-center rounded-full transition-all duration-200"
                style="width: 44px; height: 26px; padding: 3px;"
                :style="hero.availableForWork ? 'background: #30d158;' : 'background: #3a3a3c;'"
                @click="hero.availableForWork = !hero.availableForWork; markDirty()"
              >
                <span
                  class="inline-block rounded-full bg-white transition-transform duration-200"
                  style="width: 20px; height: 20px;"
                  :style="hero.availableForWork ? 'transform: translateX(18px);' : 'transform: translateX(0);'"
                />
              </button>
            </div>
            <div class="flex flex-col gap-1.5">
              <label class="text-[12px] font-medium uppercase tracking-wider" style="color: #86868b;">Subtitle</label>
              <input v-model="hero.subtitle" type="text" class="admin-input" @input="markDirty" />
            </div>
          </div>
        </div>

        <!-- Roles -->
        <div class="rounded-xl p-6" style="background: #1a1a1a; border: 1px solid #2d2d2f;">
          <h2 class="text-[15px] font-semibold mb-5" style="color: #f5f5f7;">Roles (cycling text)</h2>
          <div class="flex flex-col gap-2">
            <div v-for="(_, i) in hero.roles" :key="i" class="flex items-center gap-2">
              <span class="text-[12px] w-5 text-right shrink-0" style="color: #6e6e73;">{{ i + 1 }}</span>
              <input v-model="hero.roles[i]" type="text" placeholder="Role title" class="admin-input flex-1" @input="markDirty" />
              <button class="admin-delete-btn" @click="removeRole(i)">×</button>
            </div>
            <button class="admin-add-btn self-start" @click="addRole">+ Add role</button>
          </div>
        </div>

        <!-- Stats -->
        <div class="rounded-xl p-6" style="background: #1a1a1a; border: 1px solid #2d2d2f;">
          <h2 class="text-[15px] font-semibold mb-5" style="color: #f5f5f7;">Stats</h2>
          <div class="flex flex-col gap-2">
            <div v-for="(stat, i) in hero.stats" :key="i" class="flex items-center gap-2">
              <span class="text-[12px] w-5 text-right shrink-0" style="color: #6e6e73;">{{ i + 1 }}</span>
              <input v-model.number="stat.value" type="number" placeholder="Value" class="admin-input w-20" @input="markDirty" />
              <input v-model="stat.suffix" type="text" placeholder="Suffix" class="admin-input w-16" @input="markDirty" />
              <input v-model="stat.label" type="text" placeholder="Label" class="admin-input flex-1" @input="markDirty" />
              <button class="admin-delete-btn" @click="removeStat(i)">×</button>
            </div>
            <button class="admin-add-btn self-start" @click="addStat">+ Add stat</button>
          </div>
        </div>

        <!-- Tech Pills -->
        <div class="rounded-xl p-6" style="background: #1a1a1a; border: 1px solid #2d2d2f;">
          <h2 class="text-[15px] font-semibold mb-5" style="color: #f5f5f7;">Tech Pills</h2>
          <div class="flex flex-col gap-2">
            <div v-for="(pill, i) in hero.techPills" :key="i" class="flex items-center gap-2">
              <span class="text-[12px] w-5 text-right shrink-0" style="color: #6e6e73;">{{ i + 1 }}</span>
              <div class="relative shrink-0">
                <span class="block w-8 h-8 rounded-lg cursor-pointer border" :style="{ backgroundColor: pill.color, borderColor: '#3a3a3c' }" />
                <input type="color" :value="pill.color" class="absolute inset-0 opacity-0 cursor-pointer w-full h-full" @input="(e) => { pill.color = (e.target as HTMLInputElement).value; markDirty() }" />
              </div>
              <input v-model="pill.label" type="text" placeholder="Label" class="admin-input flex-1" @input="markDirty" />
              <input v-model="pill.color" type="text" placeholder="#hex" class="admin-input w-24 font-mono" @input="markDirty" />
              <button class="admin-delete-btn" @click="removeTechPill(i)">×</button>
            </div>
            <button class="admin-add-btn self-start" @click="addTechPill">+ Add tech pill</button>
          </div>
        </div>

        <!-- CTAs -->
        <div class="rounded-xl p-6" style="background: #1a1a1a; border: 1px solid #2d2d2f;">
          <h2 class="text-[15px] font-semibold mb-5" style="color: #f5f5f7;">Call to Action Buttons</h2>
          <div class="flex flex-col gap-4">
            <div>
              <p class="text-[12px] font-medium uppercase tracking-wider mb-2" style="color: #86868b;">Primary CTA</p>
              <div class="grid grid-cols-2 gap-3">
                <div class="flex flex-col gap-1.5">
                  <label class="text-[11px]" style="color: #6e6e73;">Label</label>
                  <input v-model="hero.ctaPrimary.label" type="text" class="admin-input" @input="markDirty" />
                </div>
                <div class="flex flex-col gap-1.5">
                  <label class="text-[11px]" style="color: #6e6e73;">Href</label>
                  <input v-model="hero.ctaPrimary.href" type="text" class="admin-input" @input="markDirty" />
                </div>
              </div>
            </div>
            <div>
              <p class="text-[12px] font-medium uppercase tracking-wider mb-2" style="color: #86868b;">Secondary CTA</p>
              <div class="grid grid-cols-2 gap-3">
                <div class="flex flex-col gap-1.5">
                  <label class="text-[11px]" style="color: #6e6e73;">Label</label>
                  <input v-model="hero.ctaSecondary.label" type="text" class="admin-input" @input="markDirty" />
                </div>
                <div class="flex flex-col gap-1.5">
                  <label class="text-[11px]" style="color: #6e6e73;">Href</label>
                  <input v-model="hero.ctaSecondary.href" type="text" class="admin-input" @input="markDirty" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Social Links -->
        <div class="rounded-xl p-6" style="background: #1a1a1a; border: 1px solid #2d2d2f;">
          <h2 class="text-[15px] font-semibold mb-5" style="color: #f5f5f7;">Social Links</h2>
          <div class="flex flex-col gap-2">
            <div v-for="(link, i) in hero.socialLinks" :key="i" class="flex items-center gap-2">
              <span class="text-[12px] w-5 text-right shrink-0" style="color: #6e6e73;">{{ i + 1 }}</span>
              <input v-model="link.label" type="text" placeholder="Label" class="admin-input w-32" @input="markDirty" />
              <input v-model="link.href" type="text" placeholder="https://..." class="admin-input flex-1" @input="markDirty" />
              <button class="admin-delete-btn" @click="removeSocialLink(i)">×</button>
            </div>
            <button class="admin-add-btn self-start" @click="addSocialLink">+ Add social link</button>
          </div>
        </div>
      </div>

      <!-- ── Navbar Editor ────────────────────────────────────────────────── -->
      <div v-else-if="activeSection === 'navbar'" class="p-8 flex flex-col gap-6">
        <div class="rounded-xl p-6" style="background: #1a1a1a; border: 1px solid #2d2d2f;">
          <h2 class="text-[15px] font-semibold mb-5" style="color: #f5f5f7;">Logo</h2>
          <div class="flex flex-col gap-1.5">
            <label class="text-[12px] font-medium uppercase tracking-wider" style="color: #86868b;">Logo Text</label>
            <input v-model="navbar.logoText" type="text" placeholder="e.g. MK" class="admin-input max-w-xs" @input="markDirty" />
          </div>
        </div>
        <div class="rounded-xl p-6" style="background: #1a1a1a; border: 1px solid #2d2d2f;">
          <h2 class="text-[15px] font-semibold mb-5" style="color: #f5f5f7;">Navigation Links</h2>
          <div class="flex flex-col gap-2">
            <div v-for="(link, i) in navbar.links" :key="i" class="flex items-center gap-2">
              <span class="text-[12px] w-5 text-right shrink-0" style="color: #6e6e73;">{{ i + 1 }}</span>
              <input v-model="link.label" type="text" placeholder="Label" class="admin-input w-36" @input="markDirty" />
              <input v-model="link.href" type="text" placeholder="#section or /path" class="admin-input flex-1" @input="markDirty" />
              <button class="admin-delete-btn" @click="removeNavLink(i)">×</button>
            </div>
            <button class="admin-add-btn self-start" @click="addNavLink">+ Add nav link</button>
          </div>
        </div>
      </div>

      <!-- ── About Editor ─────────────────────────────────────────────────── -->
      <div v-else-if="activeSection === 'about'" class="p-8 flex flex-col gap-6">
        <!-- Heading -->
        <div class="rounded-xl p-6" style="background: #1a1a1a; border: 1px solid #2d2d2f;">
          <h2 class="text-[15px] font-semibold mb-5" style="color: #f5f5f7;">Section Header</h2>
          <div class="grid grid-cols-1 gap-4">
            <div class="flex flex-col gap-1.5">
              <label class="text-[12px] font-medium uppercase tracking-wider" style="color: #86868b;">Badge Text</label>
              <input v-model="about.badge" type="text" class="admin-input" @input="markDirty" />
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div class="flex flex-col gap-1.5">
                <label class="text-[12px] font-medium uppercase tracking-wider" style="color: #86868b;">Heading Line 1</label>
                <input v-model="about.heading1" type="text" class="admin-input" @input="markDirty" />
              </div>
              <div class="flex flex-col gap-1.5">
                <label class="text-[12px] font-medium uppercase tracking-wider" style="color: #86868b;">Heading Line 2 (accent)</label>
                <input v-model="about.heading2" type="text" class="admin-input" @input="markDirty" />
              </div>
            </div>
            <div class="flex flex-col gap-1.5">
              <label class="text-[12px] font-medium uppercase tracking-wider" style="color: #86868b;">Avatar Text</label>
              <input v-model="about.avatarText" type="text" class="admin-input max-w-xs" @input="markDirty" />
            </div>
          </div>
        </div>

        <!-- Bio -->
        <div class="rounded-xl p-6" style="background: #1a1a1a; border: 1px solid #2d2d2f;">
          <h2 class="text-[15px] font-semibold mb-5" style="color: #f5f5f7;">Bio</h2>
          <div class="flex flex-col gap-4">
            <div class="flex flex-col gap-1.5">
              <label class="text-[12px] font-medium uppercase tracking-wider" style="color: #86868b;">Intro Heading</label>
              <input v-model="about.introHeading" type="text" class="admin-input" @input="markDirty" />
            </div>
            <div class="flex flex-col gap-2">
              <label class="text-[12px] font-medium uppercase tracking-wider" style="color: #86868b;">Paragraphs</label>
              <div v-for="(_, i) in about.bio" :key="i" class="flex gap-2">
                <span class="text-[12px] w-5 text-right shrink-0 pt-2" style="color: #6e6e73;">{{ i + 1 }}</span>
                <textarea v-model="about.bio[i]" rows="3" class="admin-input flex-1 resize-y" @input="markDirty" />
                <button class="admin-delete-btn self-start mt-2" @click="removeBioParagraph(i)">×</button>
              </div>
              <button class="admin-add-btn self-start" @click="addBioParagraph">+ Add paragraph</button>
            </div>
          </div>
        </div>

        <!-- Quick Facts -->
        <div class="rounded-xl p-6" style="background: #1a1a1a; border: 1px solid #2d2d2f;">
          <h2 class="text-[15px] font-semibold mb-5" style="color: #f5f5f7;">Quick Facts</h2>
          <div class="flex flex-col gap-2">
            <div v-for="(fact, i) in about.quickFacts" :key="i" class="flex items-center gap-2">
              <span class="text-[12px] w-5 text-right shrink-0" style="color: #6e6e73;">{{ i + 1 }}</span>
              <input v-model="fact.label" type="text" placeholder="Label" class="admin-input w-32" @input="markDirty" />
              <input v-model="fact.value" type="text" placeholder="Value" class="admin-input flex-1" @input="markDirty" />
              <label class="flex items-center gap-1.5 shrink-0 text-[12px]" style="color: #86868b;">
                <input type="checkbox" v-model="fact.highlight" @change="markDirty" />
                Accent
              </label>
              <button class="admin-delete-btn" @click="removeQuickFact(i)">×</button>
            </div>
            <button class="admin-add-btn self-start" @click="addQuickFact">+ Add fact</button>
          </div>
        </div>

        <!-- Journey -->
        <div class="rounded-xl p-6" style="background: #1a1a1a; border: 1px solid #2d2d2f;">
          <h2 class="text-[15px] font-semibold mb-5" style="color: #f5f5f7;">Journey Timeline</h2>
          <div class="flex flex-col gap-4">
            <div v-for="(item, i) in about.journey" :key="i" class="rounded-lg p-4" style="background: #222; border: 1px solid #333;">
              <div class="flex items-center justify-between mb-3">
                <span class="text-[13px] font-medium" style="color: #0071e3;">Entry {{ i + 1 }}</span>
                <button class="admin-delete-btn" @click="removeJourneyItem(i)">×</button>
              </div>
              <div class="grid grid-cols-2 gap-3">
                <div class="flex flex-col gap-1.5">
                  <label class="text-[11px]" style="color: #6e6e73;">Period</label>
                  <input v-model="item.period" type="text" placeholder="2019 — 2020" class="admin-input" @input="markDirty" />
                </div>
                <div class="flex flex-col gap-1.5">
                  <label class="text-[11px]" style="color: #6e6e73;">Role</label>
                  <input v-model="item.role" type="text" class="admin-input" @input="markDirty" />
                </div>
                <div class="flex flex-col gap-1.5">
                  <label class="text-[11px]" style="color: #6e6e73;">Company / Context</label>
                  <input v-model="item.company" type="text" class="admin-input" @input="markDirty" />
                </div>
                <div class="flex flex-col gap-1.5">
                  <label class="text-[11px]" style="color: #6e6e73;">Description</label>
                  <input v-model="item.description" type="text" class="admin-input" @input="markDirty" />
                </div>
              </div>
            </div>
            <button class="admin-add-btn self-start" @click="addJourneyItem">+ Add journey entry</button>
          </div>
        </div>

        <!-- Philosophy -->
        <div class="rounded-xl p-6" style="background: #1a1a1a; border: 1px solid #2d2d2f;">
          <h2 class="text-[15px] font-semibold mb-5" style="color: #f5f5f7;">Philosophy Cards</h2>
          <div class="flex flex-col gap-4">
            <div v-for="(item, i) in about.philosophy" :key="i" class="rounded-lg p-4" style="background: #222; border: 1px solid #333;">
              <div class="flex items-center justify-between mb-3">
                <span class="text-[13px] font-medium" style="color: #0071e3;">Card {{ i + 1 }}</span>
                <button class="admin-delete-btn" @click="removePhilosophyItem(i)">×</button>
              </div>
              <div class="grid grid-cols-3 gap-3">
                <div class="flex flex-col gap-1.5">
                  <label class="text-[11px]" style="color: #6e6e73;">Icon class</label>
                  <input v-model="item.icon" type="text" placeholder="i-lucide-layers" class="admin-input font-mono" @input="markDirty" />
                </div>
                <div class="flex flex-col gap-1.5">
                  <label class="text-[11px]" style="color: #6e6e73;">Title</label>
                  <input v-model="item.title" type="text" class="admin-input" @input="markDirty" />
                </div>
                <div class="flex flex-col gap-1.5">
                  <label class="text-[11px]" style="color: #6e6e73;">Text</label>
                  <input v-model="item.text" type="text" class="admin-input" @input="markDirty" />
                </div>
              </div>
            </div>
            <button class="admin-add-btn self-start" @click="addPhilosophyItem">+ Add philosophy card</button>
          </div>
        </div>
      </div>

      <!-- ── Projects Editor ──────────────────────────────────────────────── -->
      <div v-else-if="activeSection === 'projects'" class="p-8 flex flex-col gap-6">
        <!-- Header -->
        <div class="rounded-xl p-6" style="background: #1a1a1a; border: 1px solid #2d2d2f;">
          <h2 class="text-[15px] font-semibold mb-5" style="color: #f5f5f7;">Section Header</h2>
          <div class="grid grid-cols-1 gap-4">
            <div class="flex flex-col gap-1.5">
              <label class="text-[12px] font-medium uppercase tracking-wider" style="color: #86868b;">Badge Text</label>
              <input v-model="projects.badge" type="text" class="admin-input" @input="markDirty" />
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div class="flex flex-col gap-1.5">
                <label class="text-[12px] font-medium uppercase tracking-wider" style="color: #86868b;">Heading Line 1</label>
                <input v-model="projects.heading1" type="text" class="admin-input" @input="markDirty" />
              </div>
              <div class="flex flex-col gap-1.5">
                <label class="text-[12px] font-medium uppercase tracking-wider" style="color: #86868b;">Heading Line 2 (accent)</label>
                <input v-model="projects.heading2" type="text" class="admin-input" @input="markDirty" />
              </div>
            </div>
            <div class="flex flex-col gap-1.5">
              <label class="text-[12px] font-medium uppercase tracking-wider" style="color: #86868b;">Subtitle</label>
              <textarea v-model="projects.subtitle" rows="2" class="admin-input resize-y" @input="markDirty" />
            </div>
          </div>
        </div>

        <!-- Project Cards -->
        <div class="rounded-xl p-6" style="background: #1a1a1a; border: 1px solid #2d2d2f;">
          <h2 class="text-[15px] font-semibold mb-5" style="color: #f5f5f7;">Projects</h2>
          <div class="flex flex-col gap-4">
            <div v-for="(proj, i) in projects.projects" :key="i" class="rounded-lg p-5" style="background: #222; border: 1px solid #333;">
              <div class="flex items-center justify-between mb-4">
                <span class="text-[14px] font-semibold" style="color: #f5f5f7;">{{ proj.name || `Project ${i + 1}` }}</span>
                <button class="admin-delete-btn" @click="removeProject(i)">×</button>
              </div>
              <div class="grid grid-cols-2 gap-3 mb-3">
                <div class="flex flex-col gap-1.5">
                  <label class="text-[11px]" style="color: #6e6e73;">Name</label>
                  <input v-model="proj.name" type="text" class="admin-input" @input="markDirty" />
                </div>
                <div class="flex flex-col gap-1.5">
                  <label class="text-[11px]" style="color: #6e6e73;">URL</label>
                  <input v-model="proj.url" type="text" class="admin-input" @input="markDirty" />
                </div>
                <div class="flex flex-col gap-1.5">
                  <label class="text-[11px]" style="color: #6e6e73;">Role</label>
                  <input v-model="proj.role" type="text" class="admin-input" @input="markDirty" />
                </div>
                <div class="flex flex-col gap-1.5">
                  <label class="text-[11px]" style="color: #6e6e73;">Category</label>
                  <input v-model="proj.category" type="text" class="admin-input" @input="markDirty" />
                </div>
                <div class="flex flex-col gap-1.5">
                  <label class="text-[11px]" style="color: #6e6e73;">Year</label>
                  <input v-model="proj.year" type="text" class="admin-input" @input="markDirty" />
                </div>
                <div class="flex flex-col gap-1.5">
                  <label class="text-[11px]" style="color: #6e6e73;">Logo Text</label>
                  <input v-model="proj.logo" type="text" class="admin-input" @input="markDirty" />
                </div>
                <div class="flex flex-col gap-1.5">
                  <label class="text-[11px]" style="color: #6e6e73;">Brand Color</label>
                  <div class="flex items-center gap-2">
                    <div class="relative shrink-0">
                      <span class="block w-8 h-8 rounded-lg cursor-pointer border" :style="{ backgroundColor: proj.color, borderColor: '#3a3a3c' }" />
                      <input type="color" :value="proj.color" class="absolute inset-0 opacity-0 cursor-pointer w-full h-full" @input="(e) => { proj.color = (e.target as HTMLInputElement).value; markDirty() }" />
                    </div>
                    <input v-model="proj.color" type="text" class="admin-input flex-1 font-mono" @input="markDirty" />
                  </div>
                </div>
              </div>
              <div class="flex flex-col gap-1.5 mb-3">
                <label class="text-[11px]" style="color: #6e6e73;">Description</label>
                <textarea v-model="proj.description" rows="2" class="admin-input resize-y" @input="markDirty" />
              </div>
              <!-- Tech tags -->
              <div class="flex flex-col gap-1.5">
                <label class="text-[11px]" style="color: #6e6e73;">Tech Stack</label>
                <div class="flex flex-wrap items-center gap-2">
                  <div v-for="(_, ti) in proj.tech" :key="ti" class="flex items-center gap-1">
                    <input v-model="proj.tech[ti]" type="text" placeholder="Tech" class="admin-input w-28 !py-1 text-[12px]" @input="markDirty" />
                    <button class="text-[14px] px-1" style="color: #ff453a;" @click="removeProjectTech(i, ti)">×</button>
                  </div>
                  <button class="text-[12px] px-2 py-1 rounded" style="color: #0071e3; border: 1px dashed #0071e3;" @click="addProjectTech(i)">+</button>
                </div>
              </div>
            </div>
            <button class="admin-add-btn self-start" @click="addProject">+ Add project</button>
          </div>
        </div>

        <!-- Stats & CTA -->
        <div class="rounded-xl p-6" style="background: #1a1a1a; border: 1px solid #2d2d2f;">
          <h2 class="text-[15px] font-semibold mb-5" style="color: #f5f5f7;">Bottom Stats & CTA</h2>
          <div class="flex flex-col gap-4">
            <div class="flex flex-col gap-2">
              <label class="text-[12px] font-medium uppercase tracking-wider" style="color: #86868b;">Stats</label>
              <div v-for="(stat, i) in projects.stats" :key="i" class="flex items-center gap-2">
                <input v-model="stat.value" type="text" placeholder="Value" class="admin-input w-24" @input="markDirty" />
                <input v-model="stat.label" type="text" placeholder="Label" class="admin-input flex-1" @input="markDirty" />
                <button class="admin-delete-btn" @click="removeProjectStat(i)">×</button>
              </div>
              <button class="admin-add-btn self-start" @click="addProjectStat">+ Add stat</button>
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div class="flex flex-col gap-1.5">
                <label class="text-[12px] font-medium uppercase tracking-wider" style="color: #86868b;">CTA Label</label>
                <input v-model="projects.ctaLabel" type="text" class="admin-input" @input="markDirty" />
              </div>
              <div class="flex flex-col gap-1.5">
                <label class="text-[12px] font-medium uppercase tracking-wider" style="color: #86868b;">CTA Href</label>
                <input v-model="projects.ctaHref" type="text" class="admin-input" @input="markDirty" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ── Blog Editor ──────────────────────────────────────────────────── -->
      <div v-else-if="activeSection === 'blog'" class="p-8 flex flex-col gap-6">
        <!-- Header -->
        <div class="rounded-xl p-6" style="background: #1a1a1a; border: 1px solid #2d2d2f;">
          <h2 class="text-[15px] font-semibold mb-5" style="color: #f5f5f7;">Section Header</h2>
          <div class="grid grid-cols-1 gap-4">
            <div class="flex flex-col gap-1.5">
              <label class="text-[12px] font-medium uppercase tracking-wider" style="color: #86868b;">Badge Text</label>
              <input v-model="blog.badge" type="text" class="admin-input" @input="markDirty" />
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div class="flex flex-col gap-1.5">
                <label class="text-[12px] font-medium uppercase tracking-wider" style="color: #86868b;">Heading Line 1</label>
                <input v-model="blog.heading1" type="text" class="admin-input" @input="markDirty" />
              </div>
              <div class="flex flex-col gap-1.5">
                <label class="text-[12px] font-medium uppercase tracking-wider" style="color: #86868b;">Heading Line 2 (accent)</label>
                <input v-model="blog.heading2" type="text" class="admin-input" @input="markDirty" />
              </div>
            </div>
            <div class="flex flex-col gap-1.5">
              <label class="text-[12px] font-medium uppercase tracking-wider" style="color: #86868b;">Subtitle</label>
              <textarea v-model="blog.subtitle" rows="2" class="admin-input resize-y" @input="markDirty" />
            </div>
          </div>
        </div>

        <!-- Articles -->
        <div class="rounded-xl p-6" style="background: #1a1a1a; border: 1px solid #2d2d2f;">
          <h2 class="text-[15px] font-semibold mb-5" style="color: #f5f5f7;">Articles</h2>
          <div class="flex flex-col gap-4">
            <div v-for="(article, i) in blog.articles" :key="i" class="rounded-lg p-5" style="background: #222; border: 1px solid #333;">
              <div class="flex items-center justify-between mb-4">
                <span class="text-[14px] font-semibold" style="color: #f5f5f7;">{{ article.title || `Article ${i + 1}` }}</span>
                <button class="admin-delete-btn" @click="removeArticle(i)">×</button>
              </div>
              <div class="grid grid-cols-2 gap-3 mb-3">
                <div class="flex flex-col gap-1.5 col-span-2">
                  <label class="text-[11px]" style="color: #6e6e73;">Title</label>
                  <input v-model="article.title" type="text" class="admin-input" @input="markDirty" />
                </div>
                <div class="flex flex-col gap-1.5 col-span-2">
                  <label class="text-[11px]" style="color: #6e6e73;">Excerpt</label>
                  <textarea v-model="article.excerpt" rows="2" class="admin-input resize-y" @input="markDirty" />
                </div>
                <div class="flex flex-col gap-1.5">
                  <label class="text-[11px]" style="color: #6e6e73;">Date (YYYY-MM-DD)</label>
                  <input v-model="article.date" type="date" class="admin-input" @input="markDirty" />
                </div>
                <div class="flex flex-col gap-1.5">
                  <label class="text-[11px]" style="color: #6e6e73;">Read Time</label>
                  <input v-model="article.readTime" type="text" placeholder="8 min read" class="admin-input" @input="markDirty" />
                </div>
                <div class="flex flex-col gap-1.5">
                  <label class="text-[11px]" style="color: #6e6e73;">Slug</label>
                  <input v-model="article.slug" type="text" placeholder="my-article-slug" class="admin-input font-mono" @input="markDirty" />
                </div>
                <div class="flex items-center gap-3 pt-5">
                  <label class="flex items-center gap-2 text-[13px]" style="color: #f5f5f7;">
                    <input type="checkbox" v-model="article.featured" @change="markDirty" />
                    Featured
                  </label>
                </div>
              </div>
              <!-- Tags -->
              <div class="flex flex-col gap-1.5">
                <label class="text-[11px]" style="color: #6e6e73;">Tags</label>
                <div class="flex flex-wrap items-center gap-2">
                  <div v-for="(_, ti) in article.tags" :key="ti" class="flex items-center gap-1">
                    <input v-model="article.tags[ti]" type="text" placeholder="Tag" class="admin-input w-28 !py-1 text-[12px]" @input="markDirty" />
                    <button class="text-[14px] px-1" style="color: #ff453a;" @click="removeArticleTag(i, ti)">×</button>
                  </div>
                  <button class="text-[12px] px-2 py-1 rounded" style="color: #0071e3; border: 1px dashed #0071e3;" @click="addArticleTag(i)">+</button>
                </div>
              </div>
            </div>
            <button class="admin-add-btn self-start" @click="addArticle">+ Add article</button>
          </div>
        </div>
      </div>

      <!-- ── Footer Editor ────────────────────────────────────────────────── -->
      <div v-else-if="activeSection === 'footer'" class="p-8 flex flex-col gap-6">
        <!-- Contact CTA -->
        <div class="rounded-xl p-6" style="background: #1a1a1a; border: 1px solid #2d2d2f;">
          <h2 class="text-[15px] font-semibold mb-5" style="color: #f5f5f7;">Contact Section</h2>
          <div class="grid grid-cols-1 gap-4">
            <div class="flex flex-col gap-1.5">
              <label class="text-[12px] font-medium uppercase tracking-wider" style="color: #86868b;">Heading</label>
              <input v-model="footer.heading" type="text" class="admin-input" @input="markDirty" />
            </div>
            <div class="flex flex-col gap-1.5">
              <label class="text-[12px] font-medium uppercase tracking-wider" style="color: #86868b;">Subheading</label>
              <textarea v-model="footer.subheading" rows="2" class="admin-input resize-y" @input="markDirty" />
            </div>
            <div class="flex flex-col gap-1.5">
              <label class="text-[12px] font-medium uppercase tracking-wider" style="color: #86868b;">Email Address</label>
              <input v-model="footer.email" type="email" class="admin-input" @input="markDirty" />
            </div>
          </div>
        </div>

        <!-- Social Links -->
        <div class="rounded-xl p-6" style="background: #1a1a1a; border: 1px solid #2d2d2f;">
          <h2 class="text-[15px] font-semibold mb-5" style="color: #f5f5f7;">Social Links</h2>
          <div class="flex flex-col gap-2">
            <div v-for="(link, i) in footer.socialLinks" :key="i" class="flex items-center gap-2">
              <span class="text-[12px] w-5 text-right shrink-0" style="color: #6e6e73;">{{ i + 1 }}</span>
              <input v-model="link.label" type="text" placeholder="Label" class="admin-input w-28" @input="markDirty" />
              <input v-model="link.icon" type="text" placeholder="i-lucide-github" class="admin-input w-40 font-mono" @input="markDirty" />
              <input v-model="link.href" type="text" placeholder="https://..." class="admin-input flex-1" @input="markDirty" />
              <button class="admin-delete-btn" @click="removeFooterSocial(i)">×</button>
            </div>
            <button class="admin-add-btn self-start" @click="addFooterSocial">+ Add social link</button>
          </div>
        </div>

        <!-- Footer Nav -->
        <div class="rounded-xl p-6" style="background: #1a1a1a; border: 1px solid #2d2d2f;">
          <h2 class="text-[15px] font-semibold mb-5" style="color: #f5f5f7;">Footer Navigation</h2>
          <div class="flex flex-col gap-2">
            <div v-for="(link, i) in footer.navLinks" :key="i" class="flex items-center gap-2">
              <span class="text-[12px] w-5 text-right shrink-0" style="color: #6e6e73;">{{ i + 1 }}</span>
              <input v-model="link.label" type="text" placeholder="Label" class="admin-input w-32" @input="markDirty" />
              <input v-model="link.href" type="text" placeholder="#section" class="admin-input flex-1" @input="markDirty" />
              <button class="admin-delete-btn" @click="removeFooterNav(i)">×</button>
            </div>
            <button class="admin-add-btn self-start" @click="addFooterNav">+ Add footer link</button>
          </div>
        </div>

        <!-- Branding -->
        <div class="rounded-xl p-6" style="background: #1a1a1a; border: 1px solid #2d2d2f;">
          <h2 class="text-[15px] font-semibold mb-5" style="color: #f5f5f7;">Branding</h2>
          <div class="grid grid-cols-1 gap-4">
            <div class="flex flex-col gap-1.5">
              <label class="text-[12px] font-medium uppercase tracking-wider" style="color: #86868b;">Copyright Name</label>
              <input v-model="footer.copyright" type="text" class="admin-input max-w-xs" @input="markDirty" />
            </div>
            <div class="flex flex-col gap-1.5">
              <label class="text-[12px] font-medium uppercase tracking-wider" style="color: #86868b;">Tagline</label>
              <input v-model="footer.tagline" type="text" class="admin-input" @input="markDirty" />
            </div>
          </div>
        </div>
      </div>

    </main>

    <!-- ── Toast notification ──────────────────────────────────────────────── -->
    <Transition name="toast">
      <div
        v-if="toast"
        class="fixed bottom-6 right-6 flex items-center gap-3 px-4 py-3 rounded-xl text-[14px] font-medium shadow-xl"
        style="z-index: 100;"
        :style="toast.type === 'success'
          ? 'background: #1a1a1a; border: 1px solid #30d158; color: #30d158;'
          : 'background: #1a1a1a; border: 1px solid #ff453a; color: #ff453a;'"
      >
        <svg v-if="toast.type === 'success'" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
        <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
        {{ toast.message }}
      </div>
    </Transition>

  </div>
</template>

<style scoped>
.admin-input {
  border-radius: 8px;
  padding: 8px 12px;
  font-size: 14px;
  outline: none;
  transition: border-color 0.15s;
  background: #262626;
  border: 1px solid #3a3a3c;
  color: #f5f5f7;
}
.admin-input:focus {
  border-color: #0071e3;
}

.admin-delete-btn {
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 500;
  color: #ff453a;
  transition: background 0.15s;
  cursor: pointer;
  line-height: 1;
  flex-shrink: 0;
}
.admin-delete-btn:hover {
  background: rgba(255, 69, 58, 0.1);
}

.admin-add-btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  margin-top: 4px;
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 13px;
  color: #0071e3;
  border: 1px dashed #0071e3;
  transition: background 0.15s;
  cursor: pointer;
}
.admin-add-btn:hover {
  background: rgba(0, 113, 227, 0.08);
}

.toast-enter-active,
.toast-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}
.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateY(8px);
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
.animate-spin {
  animation: spin 0.8s linear infinite;
}
</style>
