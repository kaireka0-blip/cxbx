import React, { useState, useEffect } from 'react';
import { useAuth, useProfile } from './hooks/useSupabase';
import { useSupabaseData } from './hooks/useSupabaseData';
import { SupabaseService } from './services/supabaseService';
import { ViewType, Client, Project, TeamMember, Transaction, Package, AddOn, TeamProjectPayment, Profile, FinancialPocket, TeamPaymentRecord, Lead, RewardLedgerEntry, User, Card, Asset, ClientFeedback, Contract, RevisionStatus, NavigationAction, Notification, SocialMediaPost, PromoCode, SOP, CardType, PocketType, VendorData } from './types';
import { HomeIcon, FolderKanbanIcon, UsersIcon, DollarSignIcon, PlusIcon, lightenColor, darkenColor, hexToHsl } from './constants';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import { Leads } from './components/Leads';
import Booking from './components/Booking';
import Clients from './components/Clients';
import { Projects } from './components/Projects';
import { Freelancers } from './components/Freelancers';
import Finance from './components/Finance';
import Packages from './components/Packages';
import { Assets } from './components/Assets';
import Settings from './components/Settings';
import { CalendarView } from './components/CalendarView';
import Login from './components/Login';
import PublicBookingForm from './components/PublicBookingForm';
import PublicPackages from './components/PublicPackages';
import PublicFeedbackForm from './components/PublicFeedbackForm';
import PublicRevisionForm from './components/PublicRevisionForm';
import PublicLeadForm from './components/PublicLeadForm';
import Header from './components/Header';
import SuggestionForm from './components/SuggestionForm';
import ClientReports from './components/ClientKPI';
import GlobalSearch from './components/GlobalSearch';
import Contracts from './components/Contracts';
import ClientPortal from './components/ClientPortal';
import FreelancerPortal from './components/FreelancerPortal';
import { SocialPlanner } from './components/SocialPlanner';
import PromoCodes from './components/PromoCodes';
import SOPManagement from './components/SOP';
import Homepage from './components/Homepage';

const AccessDenied: React.FC<{onBackToDashboard: () => void}> = ({ onBackToDashboard }) => (
    <div className="
        flex flex-col items-center justify-center 
        h-full 
        text-center 
        p-4 sm:p-6 md:p-8
        animate-fade-in
    ">
        <div className="
            w-16 h-16 sm:w-20 sm:h-20
            rounded-full 
            bg-red-100 dark:bg-red-900/20
            flex items-center justify-center
            mb-4 sm:mb-6
        ">
            <svg className="w-8 h-8 sm:w-10 sm:h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
        </div>
        <h2 className="
            text-xl sm:text-2xl 
            font-bold 
            text-red-600 dark:text-red-400 
            mb-2 sm:mb-3
        ">
            Akses Ditolak
        </h2>
        <p className="
            text-brand-text-secondary 
            mb-6 sm:mb-8 
            max-w-md
            leading-relaxed
        ">
            Anda tidak memiliki izin untuk mengakses halaman ini.
        </p>
        <button 
            onClick={onBackToDashboard} 
            className="button-primary"
        >
            Kembali ke Dashboard
        </button>
    </div>
);

const BottomNavBar: React.FC<{ activeView: ViewType; handleNavigation: (view: ViewType) => void }> = ({ activeView, handleNavigation }) => {
    const navItems = [
        { view: ViewType.DASHBOARD, label: 'Beranda', icon: HomeIcon },
        { view: ViewType.PROJECTS, label: 'Proyek', icon: FolderKanbanIcon },
        { view: ViewType.CLIENTS, label: 'Klien', icon: UsersIcon },
        { view: ViewType.FINANCE, label: 'Keuangan', icon: DollarSignIcon },
    ];

    return (
        <nav className="
            bottom-nav 
            xl:hidden
            bg-brand-surface/95 
            backdrop-blur-xl
            border-t border-brand-border/50
        ">
            <div className="
                flex justify-around items-center 
                h-16
                px-2
            " 
            style={{
                paddingBottom: 'var(--safe-area-inset-bottom, 0px)'
            }}>
                {navItems.map(item => (
                    <button
                        key={item.view}
                        onClick={() => handleNavigation(item.view)}
                        className={`
                            flex flex-col items-center justify-center 
                            w-full h-full
                            px-2 py-2
                            rounded-xl
                            transition-all duration-200 
                            min-w-[64px] min-h-[48px]
                            relative
                            group
                            ${activeView === item.view 
                                ? 'text-brand-accent bg-brand-accent/10' 
                                : 'text-brand-text-secondary hover:text-brand-text-primary hover:bg-brand-input/50 active:bg-brand-input'
                            }
                        `}
                        aria-label={item.label}
                    >
                        {/* Enhanced Icon */}
                        <div className="
                            relative
                            mb-1
                        ">
                            <item.icon className={`
                                w-5 h-5 sm:w-6 sm:h-6
                                transition-all duration-200
                                ${activeView === item.view ? 'transform scale-110' : 'group-active:scale-95'}
                            `} />
                            
                            {/* Active indicator dot */}
                            {activeView === item.view && (
                                <div className="
                                    absolute -top-1 -right-1
                                    w-2 h-2
                                    bg-brand-accent
                                    rounded-full
                                    animate-pulse-soft
                                " />
                            )}
                        </div>
                        
                        {/* Enhanced Label */}
                        <span className={`
                            text-xs font-semibold
                            leading-tight
                            transition-all duration-200
                            ${activeView === item.view ? 'font-bold' : ''}
                        `}>
                            {item.label}
                        </span>
                        
                        {/* Background highlight */}
                        <div className={`
                            absolute inset-0
                            rounded-xl
                            transition-all duration-300
                            ${activeView === item.view 
                                ? 'bg-gradient-to-t from-brand-accent/10 to-transparent' 
                                : 'bg-transparent group-hover:bg-brand-input/30'
                            }
                        `} />
                    </button>
                ))}
            </div>
        </nav>
    );
};

const App: React.FC = () => {
  const { user: authUser, loading: authLoading } = useAuth();
  const { profile, loading: profileLoading, updateProfile } = useProfile(authUser?.id);
  const supabaseData = useSupabaseData(profile?.id);
  
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeView, setActiveView] = useState<ViewType>(ViewType.HOMEPAGE);
  const [notification, setNotification] = useState<string>('');
  const [initialAction, setInitialAction] = useState<NavigationAction | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [route, setRoute] = useState(window.location.hash || '#/home');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Check authentication status
  useEffect(() => {
    if (!authLoading) {
      setIsAuthenticated(!!authUser);
      if (authUser) {
        // Convert auth user to app user format
        setCurrentUser({
          id: authUser.id,
          email: authUser.email || '',
          password: '', // Not needed for authenticated users
          fullName: authUser.user_metadata?.full_name || '',
          companyName: authUser.user_metadata?.company_name,
          role: authUser.user_metadata?.role || 'Member',
          permissions: authUser.user_metadata?.permissions || []
        });
      } else {
        setCurrentUser(null);
      }
    }
  }, [authUser, authLoading]);

  // Loading state
  if (authLoading || profileLoading || supabaseData.loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-brand-bg">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-brand-accent border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-brand-text-secondary">Memuat aplikasi...</p>
        </div>
      </div>
    );
  }

    // --- [NEW] MOCK EMAIL SERVICE ---
    const sendEmailNotification = (recipientEmail: string, notification: Notification) => {
        console.log(`
        ========================================
        [SIMULASI EMAIL] Mengirim notifikasi ke: ${recipientEmail}
        ----------------------------------------
        Judul: ${notification.title}
        Pesan: ${notification.message}
        Waktu: ${new Date(notification.timestamp).toLocaleString('id-ID')}
        ========================================
        `);
    };

    // --- [NEW] CENTRALIZED NOTIFICATION HANDLER ---
    const addNotification = async (newNotificationData: Omit<Notification, 'id' | 'timestamp' | 'isRead'>) => {
        const newNotification: Notification = {
            id: crypto.randomUUID(),
            timestamp: new Date().toISOString(),
            isRead: false,
            ...newNotificationData
        };

        // Add to Supabase and local state will be updated via the hook
        if (profile?.id) {
          await supabase.from('notifications').insert([{
            profile_id: profile.id,
            title: newNotification.title,
            message: newNotification.message,
            icon: newNotification.icon,
            link_data: newNotification.link || {}
          }]);
          // Refetch notifications to update local state
          supabaseData.refetch();
        }

        if (profile?.email) {
            sendEmailNotification(profile.email, newNotification);
        } else {
            console.warn('[SIMULASI EMAIL] Gagal: Alamat email vendor tidak diatur di Pengaturan Profil.');
        }
    };

  useEffect(() => {
    const handleHashChange = () => {
        const newRoute = window.location.hash || '#/home';
        setRoute(newRoute);
        if (!isAuthenticated) {
            const isPublicRoute = newRoute.startsWith('#/public') || newRoute.startsWith('#/feedback') || newRoute.startsWith('#/suggestion-form') || newRoute.startsWith('#/revision-form') || newRoute.startsWith('#/portal') || newRoute.startsWith('#/freelancer-portal') || newRoute.startsWith('#/login') || newRoute === '#/home' || newRoute === '#';
            if (!isPublicRoute) {
                window.location.hash = '#/home';
            }
        } else {
            const isAuthLandingPage = newRoute.startsWith('#/login') || newRoute === '#/home' || newRoute === '#';
            if (isAuthLandingPage) {
                window.location.hash = '#/dashboard';
            }
        }
    };
    window.addEventListener('hashchange', handleHashChange);
    handleHashChange(); // Initial check
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [isAuthenticated]);

  useEffect(() => {
      const path = (route.split('?')[0].split('/')[1] || 'home').toLowerCase();
      const newView = Object.values(ViewType).find(v => 
          v.toLowerCase().replace(/ /g, '-') === path
      );
      if (newView) {
          setActiveView(newView);
      } else if (path === 'team') { // Handle 'Freelancer' mapping to 'team' route
          setActiveView(ViewType.TEAM);
      }
  }, [route]);
  
  useEffect(() => {
        const styleElement = document.getElementById('public-theme-style');
        const isPublicRoute = route.startsWith('#/public') || route.startsWith('#/portal') || route.startsWith('#/freelancer-portal');
        
        document.body.classList.toggle('app-theme', !isPublicRoute);
        document.body.classList.toggle('public-page-body', isPublicRoute);

        if (isPublicRoute) {
            const brandColor = profile?.brandColor || '#3b82f6';
            
            if (styleElement) {
                const hoverColor = darkenColor(brandColor, 10);
                const brandHsl = hexToHsl(brandColor);
                styleElement.innerHTML = `
                    :root {
                        --public-accent: ${brandColor};
                        --public-accent-hover: ${hoverColor};
                        --public-accent-hsl: ${brandHsl};
                    }
                `;
            }
        } else if (styleElement) {
            styleElement.innerHTML = '';
        }

    }, [route, profile?.brandColor]);

  const showNotification = (message: string, duration: number = 3000) => {
    setNotification(message);
    setTimeout(() => {
      setNotification('');
    }, duration);
  };

  const handleSetProfile = async (value: React.SetStateAction<Profile>) => {
    if (!profile) return;
    
    const newProfile = typeof value === 'function' ? value(profile) : value;
    const result = await updateProfile(newProfile);
    
    if (result.error) {
      showNotification('Gagal memperbarui profil: ' + result.error);
    }
  };

  const handleLoginSuccess = async (email: string, password: string) => {
    const result = await SupabaseService.signIn(email, password);
    if (result.user) {
      setIsAuthenticated(true);
      setCurrentUser(result.user);
      window.location.hash = '#/dashboard';
    } else {
      showNotification(result.error || 'Login gagal');
    }
  };
  
  const handleLogout = async () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    window.location.hash = '#/dashboard';
  };
  

  const handleMarkAsRead = async (notificationId: string) => {
    await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', notificationId);
    supabaseData.refetch();
  };
  
  const handleMarkAllAsRead = async () => {
    if (profile?.id) {
      await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('profile_id', profile.id);
      supabaseData.refetch();
    }
  };

  const handleNavigation = (view: ViewType, action?: NavigationAction, notificationId?: string) => {
        const pathMap: { [key in ViewType]: string } = {
            [ViewType.HOMEPAGE]: 'home',
            [ViewType.DASHBOARD]: 'dashboard',
            [ViewType.PROSPEK]: 'prospek',
            [ViewType.BOOKING]: 'booking',
            [ViewType.CLIENTS]: 'clients',
            [ViewType.PROJECTS]: 'projects',
            [ViewType.TEAM]: 'team',
            [ViewType.FINANCE]: 'finance',
            [ViewType.CALENDAR]: 'calendar',
            [ViewType.SOCIAL_MEDIA_PLANNER]: 'social-media-planner',
            [ViewType.PACKAGES]: 'packages',
            [ViewType.ASSETS]: 'assets',
            [ViewType.CONTRACTS]: 'contracts',
            [ViewType.PROMO_CODES]: 'promo-codes',
            [ViewType.SOP]: 'sop',
            [ViewType.CLIENT_REPORTS]: 'client-reports',
            [ViewType.SETTINGS]: 'settings',
        };

    const newRoute = `#/${pathMap[view] || view.toLowerCase().replace(/ /g, '-')}`;

    window.location.hash = newRoute;

    setActiveView(view);
    setInitialAction(action || null);
    setIsSidebarOpen(false); // Close sidebar on navigation
    setIsSearchOpen(false); // Close search on navigation
    if (notificationId) {
        handleMarkAsRead(notificationId);
    }
  };

  const hasPermission = (view: ViewType) => {
    if (!currentUser) return false;
    if (currentUser.role === 'Admin') return true;
    if (view === ViewType.DASHBOARD) return true;
    return currentUser.permissions?.includes(view) || false;
  };
  
  const renderView = () => {
    if (!hasPermission(activeView)) {
        return <AccessDenied onBackToDashboard={() => setActiveView(ViewType.DASHBOARD)} />;
    }
    
    if (!profile) {
      return (
        <div className="flex items-center justify-center h-full">
          <p className="text-brand-text-secondary">Profil tidak ditemukan</p>
        </div>
      );
    }
    
    switch (activeView) {
      case ViewType.DASHBOARD:
        return <Dashboard 
          projects={supabaseData.projects} 
          clients={supabaseData.clients} 
          transactions={supabaseData.transactions} 
          teamMembers={supabaseData.teamMembers}
          cards={supabaseData.cards}
          pockets={supabaseData.pockets}
          handleNavigation={handleNavigation}
          leads={supabaseData.leads}
          teamProjectPayments={supabaseData.teamProjectPayments}
          packages={supabaseData.packages}
          assets={supabaseData.assets}
          clientFeedback={supabaseData.clientFeedback}
          contracts={supabaseData.contracts}
          currentUser={currentUser}
          projectStatusConfig={profile?.projectStatusConfig || []}
        />;
      case ViewType.PROSPEK:
        return <Leads
            leads={supabaseData.leads} 
            setLeads={(leads) => {/* Handle via CRUD operations */}}
            clients={supabaseData.clients} 
            setClients={(clients) => {/* Handle via CRUD operations */}}
            projects={supabaseData.projects} 
            setProjects={(projects) => {/* Handle via CRUD operations */}}
            packages={supabaseData.packages} 
            addOns={supabaseData.addOns}
            transactions={supabaseData.transactions} 
            setTransactions={(transactions) => {/* Handle via CRUD operations */}}
            userProfile={profile} 
            setProfile={handleSetProfile} 
            showNotification={showNotification}
            cards={supabaseData.cards} 
            setCards={(cards) => {/* Handle via CRUD operations */}}
            pockets={supabaseData.pockets} 
            setPockets={(pockets) => {/* Handle via CRUD operations */}}
            promoCodes={supabaseData.promoCodes} 
            setPromoCodes={(promoCodes) => {/* Handle via CRUD operations */}}
        />;
      case ViewType.BOOKING:
        return <Booking
            leads={supabaseData.leads}
            clients={supabaseData.clients}
            projects={supabaseData.projects}
            setProjects={(projects) => {/* Handle via CRUD operations */}}
            packages={supabaseData.packages}
            userProfile={profile}
            setProfile={handleSetProfile}
            handleNavigation={handleNavigation}
            showNotification={showNotification}
        />;
      case ViewType.CLIENTS:
        return <Clients
          clients={supabaseData.clients} 
          setClients={(clients) => {/* Handle via CRUD operations */}}
          projects={supabaseData.projects} 
          setProjects={(projects) => {/* Handle via CRUD operations */}}
          packages={supabaseData.packages} 
          addOns={supabaseData.addOns}
          transactions={supabaseData.transactions} 
          setTransactions={(transactions) => {/* Handle via CRUD operations */}}
          userProfile={profile}
          showNotification={showNotification}
          initialAction={initialAction} 
          setInitialAction={setInitialAction}
          cards={supabaseData.cards} 
          setCards={(cards) => {/* Handle via CRUD operations */}}
          pockets={supabaseData.pockets} 
          setPockets={(pockets) => {/* Handle via CRUD operations */}}
          contracts={supabaseData.contracts}
          handleNavigation={handleNavigation}
          clientFeedback={supabaseData.clientFeedback}
          promoCodes={supabaseData.promoCodes} 
          setPromoCodes={(promoCodes) => {/* Handle via CRUD operations */}}
          onSignInvoice={async (pId, sig) => {
            await supabaseData.updateProject(pId, { invoiceSignature: sig });
          }}
          onSignTransaction={async (tId, sig) => {
            // Handle transaction signature update
          }}
          addNotification={addNotification}
        />;
      case ViewType.PROJECTS:
        return <Projects 
          projects={supabaseData.projects} 
          setProjects={(projects) => {/* Handle via CRUD operations */}}
          clients={supabaseData.clients}
          packages={supabaseData.packages}
          teamMembers={supabaseData.teamMembers}
          teamProjectPayments={supabaseData.teamProjectPayments} 
          setTeamProjectPayments={(payments) => {/* Handle via CRUD operations */}}
          transactions={supabaseData.transactions} 
          setTransactions={(transactions) => {/* Handle via CRUD operations */}}
          initialAction={initialAction} 
          setInitialAction={setInitialAction}
          profile={profile}
          showNotification={showNotification}
          cards={supabaseData.cards}
          setCards={(cards) => {/* Handle via CRUD operations */}}
        />;
      case ViewType.TEAM:
        return (
          <Freelancers
            teamMembers={supabaseData.teamMembers}
            setTeamMembers={(members) => {/* Handle via CRUD operations */}}
            teamProjectPayments={supabaseData.teamProjectPayments}
            setTeamProjectPayments={(payments) => {/* Handle via CRUD operations */}}
            teamPaymentRecords={supabaseData.teamPaymentRecords}
            setTeamPaymentRecords={(records) => {/* Handle via CRUD operations */}}
            transactions={supabaseData.transactions}
            setTransactions={(transactions) => {/* Handle via CRUD operations */}}
            userProfile={profile}
            showNotification={showNotification}
            initialAction={initialAction}
            setInitialAction={setInitialAction}
            projects={supabaseData.projects}
            setProjects={(projects) => {/* Handle via CRUD operations */}}
            rewardLedgerEntries={supabaseData.rewardLedgerEntries}
            setRewardLedgerEntries={(entries) => {/* Handle via CRUD operations */}}
            pockets={supabaseData.pockets}
            setPockets={(pockets) => {/* Handle via CRUD operations */}}
            cards={supabaseData.cards}
            setCards={(cards) => {/* Handle via CRUD operations */}}
            onSignPaymentRecord={async (rId, sig) => {
              // Handle payment record signature update
            }}
          />
        );
      case ViewType.FINANCE:
        return <Finance 
          transactions={supabaseData.transactions} 
          setTransactions={(transactions) => {/* Handle via CRUD operations */}}
          pockets={supabaseData.pockets} 
          setPockets={(pockets) => {/* Handle via CRUD operations */}}
          projects={supabaseData.projects}
          profile={profile}
          cards={supabaseData.cards} 
          setCards={(cards) => {/* Handle via CRUD operations */}}
          teamMembers={supabaseData.teamMembers}
          rewardLedgerEntries={supabaseData.rewardLedgerEntries}
        />;
      case ViewType.PACKAGES:
        return <Packages 
          packages={supabaseData.packages} 
          setPackages={(packages) => {/* Handle via CRUD operations */}} 
          addOns={supabaseData.addOns} 
          setAddOns={(addOns) => {/* Handle via CRUD operations */}} 
          projects={supabaseData.projects} 
          profile={profile} 
        />;
      case ViewType.ASSETS:
        return <Assets 
          assets={supabaseData.assets} 
          setAssets={(assets) => {/* Handle via CRUD operations */}} 
          profile={profile} 
          showNotification={showNotification} 
        />;
      case ViewType.CONTRACTS:
        return <Contracts 
            contracts={supabaseData.contracts} 
            setContracts={(contracts) => {/* Handle via CRUD operations */}}
            clients={supabaseData.clients} 
            projects={supabaseData.projects} 
            profile={profile}
            showNotification={showNotification}
            initialAction={initialAction} 
            setInitialAction={setInitialAction}
            packages={supabaseData.packages}
            onSignContract={async (cId, sig, signer) => {
              // Handle contract signature update
            }}
        />;
      case ViewType.SOP:
        return <SOPManagement 
          sops={supabaseData.sops} 
          setSops={(sops) => {/* Handle via CRUD operations */}} 
          profile={profile} 
          showNotification={showNotification} 
        />;
      case ViewType.SETTINGS:
        return <Settings 
          profile={profile} 
          setProfile={handleSetProfile} 
          transactions={supabaseData.transactions} 
          projects={supabaseData.projects}
          packages={supabaseData.packages}
          users={[]} // Will be handled separately
          setUsers={(users) => {/* Handle via CRUD operations */}}
          currentUser={currentUser}
        />;
      case ViewType.CALENDAR:
        return <CalendarView 
          projects={supabaseData.projects} 
          setProjects={(projects) => {/* Handle via CRUD operations */}} 
          teamMembers={supabaseData.teamMembers} 
          profile={profile} 
        />;
      case ViewType.CLIENT_REPORTS:
        return <ClientReports 
            clients={supabaseData.clients}
            leads={supabaseData.leads}
            projects={supabaseData.projects}
            feedback={supabaseData.clientFeedback}
            setFeedback={(feedback) => {/* Handle via CRUD operations */}}
            showNotification={showNotification}
        />;
      case ViewType.SOCIAL_MEDIA_PLANNER:
        return <SocialPlanner 
          posts={supabaseData.socialMediaPosts} 
          setPosts={(posts) => {/* Handle via CRUD operations */}} 
          projects={supabaseData.projects} 
          showNotification={showNotification} 
        />;
      case ViewType.PROMO_CODES:
        return <PromoCodes 
          promoCodes={supabaseData.promoCodes} 
          setPromoCodes={(promoCodes) => {/* Handle via CRUD operations */}} 
          projects={supabaseData.projects} 
          showNotification={showNotification} 
        />;
      default:
        return <div />;
    }
  };
  
  // --- ROUTING LOGIC ---
  if (route.startsWith('#/home') || route === '#/') return <Homepage />;
  if (route.startsWith('#/login')) return <Login onLoginSuccess={handleLoginSuccess} />;
  
  if (route.startsWith('#/public-packages')) {
    return <PublicPackages
        packages={supabaseData.packages}
        addOns={supabaseData.addOns}
        userProfile={profile}
        showNotification={showNotification}
        setClients={(clients) => {/* Handle via CRUD operations */}}
        setProjects={(projects) => {/* Handle via CRUD operations */}}
        setTransactions={(transactions) => {/* Handle via CRUD operations */}}
        setCards={(cards) => {/* Handle via CRUD operations */}}
        setLeads={(leads) => {/* Handle via CRUD operations */}}
        addNotification={addNotification}
        cards={supabaseData.cards}
        promoCodes={supabaseData.promoCodes}
        setPromoCodes={(promoCodes) => {/* Handle via CRUD operations */}}
    />;
  }
  if (route.startsWith('#/public-booking')) {
    return <PublicBookingForm 
      userProfile={profile}
      packages={supabaseData.packages}
      addOns={supabaseData.addOns}
      cards={supabaseData.cards}
      pockets={supabaseData.pockets}
      promoCodes={supabaseData.promoCodes}
      leads={supabaseData.leads}
      showNotification={showNotification} 
      setClients={(clients) => {/* Handle via CRUD operations */}} 
      setProjects={(projects) => {/* Handle via CRUD operations */}} 
      setTransactions={(transactions) => {/* Handle via CRUD operations */}} 
      setCards={(cards) => {/* Handle via CRUD operations */}} 
      setPockets={(pockets) => {/* Handle via CRUD operations */}} 
      setPromoCodes={(promoCodes) => {/* Handle via CRUD operations */}} 
      setLeads={(leads) => {/* Handle via CRUD operations */}} 
      addNotification={addNotification} 
    />;
  }
  if (route.startsWith('#/public-lead-form')) {
    return <PublicLeadForm 
      setLeads={(leads) => {/* Handle via CRUD operations */}} 
      userProfile={profile} 
      showNotification={showNotification} 
    />;
  }
  
  if (route.startsWith('#/feedback')) return <PublicFeedbackForm setClientFeedback={(feedback) => {/* Handle via CRUD operations */}} />;
  if (route.startsWith('#/suggestion-form')) return <SuggestionForm setLeads={(leads) => {/* Handle via CRUD operations */}} />;
  if (route.startsWith('#/revision-form')) return <PublicRevisionForm 
    projects={supabaseData.projects} 
    teamMembers={supabaseData.teamMembers} 
    onUpdateRevision={async (pId, rId, data) => {
      const project = supabaseData.projects.find(p => p.id === pId);
      if (project) {
        const updatedRevisions = project.revisions?.map(r => 
          r.id === rId ? { ...r, ...data, completedDate: new Date().toISOString() } : r
        );
        await supabaseData.updateProject(pId, { revisions: updatedRevisions });
      }
    }} 
  />;
  if (route.startsWith('#/portal/')) {
    const accessId = route.split('/portal/')[1];
    return <ClientPortal 
      accessId={accessId} 
      clients={supabaseData.clients} 
      projects={supabaseData.projects} 
      setClientFeedback={(feedback) => {/* Handle via CRUD operations */}} 
      showNotification={showNotification} 
      contracts={supabaseData.contracts} 
      transactions={supabaseData.transactions} 
      userProfile={profile} 
      packages={supabaseData.packages} 
      onClientConfirmation={async (pId, stage) => {
        const updates: any = {};
        updates[`is${stage.charAt(0).toUpperCase() + stage.slice(1)}ConfirmedByClient`] = true;
        await supabaseData.updateProject(pId, updates);
      }} 
      onClientSubStatusConfirmation={async (pId, sub, note) => {
        const project = supabaseData.projects.find(p => p.id === pId);
        if (project) {
          await supabaseData.updateProject(pId, {
            confirmedSubStatuses: [...(project.confirmedSubStatuses || []), sub],
            clientSubStatusNotes: { ...(project.clientSubStatusNotes || {}), [sub]: note }
          });
        }
      }} 
      onSignContract={async (cId, sig, signer) => {
        // Handle contract signature update
      }} 
    />;
  }
  if (route.startsWith('#/freelancer-portal/')) {
     const accessId = route.split('/freelancer-portal/')[1];
     return <FreelancerPortal 
       accessId={accessId} 
       teamMembers={supabaseData.teamMembers} 
       projects={supabaseData.projects} 
       teamProjectPayments={supabaseData.teamProjectPayments} 
       teamPaymentRecords={supabaseData.teamPaymentRecords} 
       rewardLedgerEntries={supabaseData.rewardLedgerEntries} 
       showNotification={showNotification} 
       onUpdateRevision={async (pId, rId, data) => {
         const project = supabaseData.projects.find(p => p.id === pId);
         if (project) {
           const updatedRevisions = project.revisions?.map(r => 
             r.id === rId ? { ...r, ...data, completedDate: new Date().toISOString() } : r
           );
           await supabaseData.updateProject(pId, { revisions: updatedRevisions });
         }
       }} 
       sops={supabaseData.sops} 
       userProfile={profile} 
     />;
  }

  if (!isAuthenticated) return <Login onLoginSuccess={handleLoginSuccess} />;

  return (
    <div className="
        flex h-screen 
        bg-brand-bg 
        text-brand-text-primary
        overflow-hidden
    ">
      <Sidebar 
        activeView={activeView} 
        setActiveView={(view) => handleNavigation(view)} 
        isOpen={isSidebarOpen} 
        setIsOpen={setIsSidebarOpen}
        currentUser={currentUser}
      />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
            pageTitle={activeView} 
            toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
            setIsSearchOpen={setIsSearchOpen}
            notifications={supabaseData.notifications}
            handleNavigation={handleNavigation}
            handleMarkAllAsRead={handleMarkAllAsRead}
            currentUser={currentUser}
            profile={profile}
            handleLogout={handleLogout}
        />
        
        <main className="
            flex-1 
            overflow-x-hidden 
            overflow-y-auto 
            p-3 sm:p-4 md:p-6 lg:p-8 
            pb-20 xl:pb-8
            overscroll-contain
        " 
        style={{ 
            WebkitOverflowScrolling: 'touch',
            paddingBottom: 'calc(5rem + var(--safe-area-inset-bottom, 0px))'
        }}>
            <div className="animate-fade-in">
                {renderView()}
            </div>
        </main>
      </div>
      
      {/* Enhanced Notification Toast */}
      {notification && (
        <div className="
            fixed top-4 right-4 
            sm:top-6 sm:right-6
            bg-brand-accent 
            text-white 
            py-3 px-4 sm:py-4 sm:px-6
            rounded-xl 
            shadow-2xl 
            z-50 
            animate-fade-in-out
            backdrop-blur-sm
            border border-brand-accent-hover/20
            max-w-sm
            break-words
        "
        style={{
            top: 'calc(1rem + var(--safe-area-inset-top, 0px))',
            right: 'calc(1rem + var(--safe-area-inset-right, 0px))'
        }}>
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse-soft" />
            <span className="font-medium text-sm sm:text-base">{notification}</span>
          </div>
        </div>
      )}
      
      <GlobalSearch 
        isOpen={isSearchOpen} 
        onClose={() => setIsSearchOpen(false)} 
        clients={supabaseData.clients}
        projects={supabaseData.projects}
        teamMembers={supabaseData.teamMembers}
        handleNavigation={handleNavigation}
      />
      
      <BottomNavBar activeView={activeView} handleNavigation={handleNavigation} />
    </div>
  );
};

export default App;