import { supabase } from '../lib/supabase';
import type { Database } from '../lib/database.types';
import { 
  Client, Project, Package, AddOn, TeamMember, Lead, Transaction, 
  Card, FinancialPocket, Asset, Contract, PromoCode, SOP, 
  ClientFeedback, SocialMediaPost, Notification, TeamProjectPayment,
  TeamPaymentRecord, RewardLedgerEntry, Profile, User
} from '../types';

type Tables = Database['public']['Tables'];

// Helper function to convert database row to app type
const convertProfile = (row: Tables['profiles']['Row']): Profile => ({
  id: row.id,
  adminUserId: row.admin_user_id,
  fullName: row.full_name,
  email: row.email,
  phone: row.phone,
  companyName: row.company_name,
  website: row.website,
  address: row.address,
  bankAccount: row.bank_account,
  authorizedSigner: row.authorized_signer,
  idNumber: row.id_number,
  bio: row.bio,
  incomeCategories: row.income_categories as string[],
  expenseCategories: row.expense_categories as string[],
  projectTypes: row.project_types as string[],
  eventTypes: row.event_types as string[],
  assetCategories: row.asset_categories as string[],
  sopCategories: row.sop_categories as string[],
  packageCategories: row.package_categories as string[],
  projectStatusConfig: row.project_status_config as any[],
  notificationSettings: row.notification_settings as any,
  securitySettings: row.security_settings as any,
  briefingTemplate: row.briefing_template,
  termsAndConditions: row.terms_and_conditions,
  contractTemplate: row.contract_template,
  logoBase64: row.logo_base64,
  brandColor: row.brand_color,
  publicPageConfig: row.public_page_config as any,
  packageShareTemplate: row.package_share_template,
  bookingFormTemplate: row.booking_form_template,
  chatTemplates: row.chat_templates as any[]
});

const convertClient = (row: Tables['clients']['Row']): Client => ({
  id: row.id,
  name: row.name,
  email: row.email,
  phone: row.phone,
  whatsapp: row.whatsapp,
  instagram: row.instagram,
  clientType: row.client_type as any,
  status: row.status as any,
  since: row.since,
  lastContact: row.last_contact,
  portalAccessId: row.portal_access_id
});

const convertProject = (row: Tables['projects']['Row']): Project => ({
  id: row.id,
  projectName: row.project_name,
  clientName: row.client_name,
  clientId: row.client_id,
  projectType: row.project_type,
  packageName: row.package_name,
  packageId: row.package_id || '',
  addOns: row.add_ons as any[],
  date: row.date,
  deadlineDate: row.deadline_date || '',
  location: row.location,
  progress: row.progress,
  status: row.status,
  activeSubStatuses: row.active_sub_statuses as string[],
  totalCost: row.total_cost,
  amountPaid: row.amount_paid,
  paymentStatus: row.payment_status as any,
  team: row.team as any[],
  notes: row.notes,
  accommodation: row.accommodation,
  driveLink: row.drive_link,
  clientDriveLink: row.client_drive_link,
  finalDriveLink: row.final_drive_link,
  startTime: row.start_time,
  endTime: row.end_time,
  image: row.image,
  revisions: row.revisions as any[],
  promoCodeId: row.promo_code_id || undefined,
  discountAmount: row.discount_amount,
  shippingDetails: row.shipping_details,
  dpProofUrl: row.dp_proof_url,
  printingDetails: row.printing_details as any[],
  printingCost: row.printing_cost,
  transportCost: row.transport_cost,
  isEditingConfirmedByClient: row.is_editing_confirmed_by_client,
  isPrintingConfirmedByClient: row.is_printing_confirmed_by_client,
  isDeliveryConfirmedByClient: row.is_delivery_confirmed_by_client,
  confirmedSubStatuses: row.confirmed_sub_statuses as string[],
  clientSubStatusNotes: row.client_sub_status_notes as any,
  subStatusConfirmationSentAt: row.sub_status_confirmation_sent_at as any,
  completedDigitalItems: row.completed_digital_items as string[],
  invoiceSignature: row.invoice_signature,
  customSubStatuses: row.custom_sub_statuses as any[],
  bookingStatus: row.booking_status as any,
  rejectionReason: row.rejection_reason,
  chatHistory: row.chat_history as any[]
});

// Service functions
export class SupabaseService {
  static async getProfileByUserId(userId: string) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('admin_user_id', userId)
      .single();
    
    if (error) return { data: null, error };
    return { data: convertProfile(data), error: null };
  }

  static async getAllData(profileId: string) {
    try {
      const [
        clientsResult,
        projectsResult,
        packagesResult,
        addOnsResult,
        teamMembersResult,
        leadsResult,
        transactionsResult,
        cardsResult,
        pocketsResult,
        assetsResult,
        contractsResult,
        promoCodesResult,
        sopsResult,
        clientFeedbackResult,
        socialMediaPostsResult,
        notificationsResult,
        teamProjectPaymentsResult,
        teamPaymentRecordsResult,
        rewardLedgerEntriesResult
      ] = await Promise.all([
        supabase.from('clients').select('*').eq('profile_id', profileId),
        supabase.from('projects').select('*').eq('profile_id', profileId),
        supabase.from('packages').select('*').eq('profile_id', profileId),
        supabase.from('add_ons').select('*').eq('profile_id', profileId),
        supabase.from('team_members').select('*').eq('profile_id', profileId),
        supabase.from('leads').select('*').eq('profile_id', profileId),
        supabase.from('transactions').select('*').eq('profile_id', profileId),
        supabase.from('cards').select('*').eq('profile_id', profileId),
        supabase.from('pockets').select('*').eq('profile_id', profileId),
        supabase.from('assets').select('*').eq('profile_id', profileId),
        supabase.from('contracts').select('*').eq('profile_id', profileId),
        supabase.from('promo_codes').select('*').eq('profile_id', profileId),
        supabase.from('sops').select('*').eq('profile_id', profileId),
        supabase.from('client_feedback').select('*').eq('profile_id', profileId),
        supabase.from('social_media_posts').select('*').eq('profile_id', profileId),
        supabase.from('notifications').select('*').eq('profile_id', profileId),
        supabase.from('team_project_payments').select('*').eq('profile_id', profileId),
        supabase.from('team_payment_records').select('*').eq('profile_id', profileId),
        supabase.from('reward_ledger_entries').select('*').eq('profile_id', profileId)
      ]);

      return {
        clients: clientsResult.data?.map(convertClient) || [],
        projects: projectsResult.data?.map(convertProject) || [],
        packages: packagesResult.data?.map(row => ({
          id: row.id,
          name: row.name,
          price: row.price,
          category: row.category,
          physicalItems: row.physical_items as any[],
          digitalItems: row.digital_items as string[],
          processingTime: row.processing_time,
          defaultPrintingCost: row.default_printing_cost,
          defaultTransportCost: row.default_transport_cost,
          photographers: row.photographers,
          videographers: row.videographers,
          coverImage: row.cover_image
        } as Package)) || [],
        addOns: addOnsResult.data?.map(row => ({
          id: row.id,
          name: row.name,
          price: row.price
        } as AddOn)) || [],
        teamMembers: teamMembersResult.data?.map(row => ({
          id: row.id,
          name: row.name,
          role: row.role,
          email: row.email,
          phone: row.phone,
          standardFee: row.standard_fee,
          noRek: row.no_rek,
          rewardBalance: row.reward_balance,
          rating: row.rating,
          performanceNotes: row.performance_notes as any[],
          portalAccessId: row.portal_access_id
        } as TeamMember)) || [],
        leads: leadsResult.data?.map(row => ({
          id: row.id,
          name: row.name,
          contactChannel: row.contact_channel as any,
          location: row.location,
          status: row.status as any,
          date: row.date,
          notes: row.notes,
          whatsapp: row.whatsapp
        } as Lead)) || [],
        transactions: transactionsResult.data?.map(row => ({
          id: row.id,
          date: row.date,
          description: row.description,
          amount: row.amount,
          type: row.type as any,
          projectId: row.project_id || undefined,
          category: row.category,
          method: row.method as any,
          cardId: row.card_id || undefined,
          pocketId: row.pocket_id || undefined,
          printingItemId: row.printing_item_id,
          vendorSignature: row.vendor_signature
        } as Transaction)) || [],
        cards: cardsResult.data?.map(row => ({
          id: row.id,
          cardHolderName: row.card_holder_name,
          bankName: row.bank_name,
          cardType: row.card_type as any,
          lastFourDigits: row.last_four_digits,
          expiryDate: row.expiry_date,
          balance: row.balance,
          colorGradient: row.color_gradient
        } as Card)) || [],
        pockets: pocketsResult.data?.map(row => ({
          id: row.id,
          name: row.name,
          description: row.description,
          icon: row.icon as any,
          type: row.type as any,
          amount: row.amount,
          goalAmount: row.goal_amount,
          lockEndDate: row.lock_end_date || undefined,
          members: row.members as any[],
          sourceCardId: row.source_card_id || undefined
        } as FinancialPocket)) || [],
        assets: assetsResult.data?.map(row => ({
          id: row.id,
          name: row.name,
          category: row.category,
          purchaseDate: row.purchase_date,
          purchasePrice: row.purchase_price,
          serialNumber: row.serial_number,
          status: row.status as any,
          notes: row.notes
        } as Asset)) || [],
        contracts: contractsResult.data?.map(row => ({
          id: row.id,
          contractNumber: row.contract_number,
          clientId: row.client_id,
          projectId: row.project_id,
          signingDate: row.signing_date,
          signingLocation: row.signing_location,
          createdAt: row.created_at,
          clientName1: row.client_name1,
          clientAddress1: row.client_address1,
          clientPhone1: row.client_phone1,
          clientName2: row.client_name2,
          clientAddress2: row.client_address2,
          clientPhone2: row.client_phone2,
          shootingDuration: row.shooting_duration,
          guaranteedPhotos: row.guaranteed_photos,
          albumDetails: row.album_details,
          digitalFilesFormat: row.digital_files_format,
          otherItems: row.other_items,
          personnelCount: row.personnel_count,
          deliveryTimeframe: row.delivery_timeframe,
          dpDate: row.dp_date || '',
          finalPaymentDate: row.final_payment_date || '',
          cancellationPolicy: row.cancellation_policy,
          jurisdiction: row.jurisdiction,
          vendorSignature: row.vendor_signature,
          clientSignature: row.client_signature
        } as Contract)) || [],
        promoCodes: promoCodesResult.data?.map(row => ({
          id: row.id,
          code: row.code,
          discountType: row.discount_type as any,
          discountValue: row.discount_value,
          isActive: row.is_active,
          usageCount: row.usage_count,
          maxUsage: row.max_usage || undefined,
          expiryDate: row.expiry_date || undefined,
          createdAt: row.created_at
        } as PromoCode)) || [],
        sops: sopsResult.data?.map(row => ({
          id: row.id,
          title: row.title,
          category: row.category,
          content: row.content,
          lastUpdated: row.last_updated
        } as SOP)) || [],
        clientFeedback: clientFeedbackResult.data?.map(row => ({
          id: row.id,
          clientName: row.client_name,
          satisfaction: row.satisfaction as any,
          rating: row.rating,
          feedback: row.feedback,
          date: row.date
        } as ClientFeedback)) || [],
        socialMediaPosts: socialMediaPostsResult.data?.map(row => ({
          id: row.id,
          projectId: row.project_id,
          clientName: row.client_name,
          postType: row.post_type as any,
          platform: row.platform as any,
          scheduledDate: row.scheduled_date,
          caption: row.caption,
          mediaUrl: row.media_url,
          status: row.status as any,
          notes: row.notes
        } as SocialMediaPost)) || [],
        notifications: notificationsResult.data?.map(row => ({
          id: row.id,
          title: row.title,
          message: row.message,
          timestamp: row.timestamp,
          isRead: row.is_read,
          icon: row.icon as any,
          link: row.link_data as any
        } as Notification)) || [],
        teamProjectPayments: teamProjectPaymentsResult.data?.map(row => ({
          id: row.id,
          projectId: row.project_id,
          teamMemberName: row.team_member_name,
          teamMemberId: row.team_member_id,
          date: row.date,
          status: row.status as any,
          fee: row.fee,
          reward: row.reward
        } as TeamProjectPayment)) || [],
        teamPaymentRecords: teamPaymentRecordsResult.data?.map(row => ({
          id: row.id,
          recordNumber: row.record_number,
          teamMemberId: row.team_member_id,
          date: row.date,
          projectPaymentIds: row.project_payment_ids as string[],
          totalAmount: row.total_amount,
          vendorSignature: row.vendor_signature
        } as TeamPaymentRecord)) || [],
        rewardLedgerEntries: rewardLedgerEntriesResult.data?.map(row => ({
          id: row.id,
          teamMemberId: row.team_member_id,
          date: row.date,
          description: row.description,
          amount: row.amount,
          projectId: row.project_id || undefined
        } as RewardLedgerEntry)) || []
      };
    } catch (error) {
      console.error('Error fetching all data:', error);
      throw error;
    }
  }

  // Authentication
  static async signIn(email: string, password: string) {
    // For demo purposes, we'll use a simple email/password check
    // In production, you'd use proper Supabase auth
    const { data: users, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !users) {
      return { user: null, error: 'Invalid credentials' };
    }

    // In production, you'd verify the password hash
    // For demo, we'll just check if password matches a simple pattern
    const isValidPassword = password === 'admin' || password === 'member';
    
    if (!isValidPassword) {
      return { user: null, error: 'Invalid credentials' };
    }

    const user: User = {
      id: users.id,
      email: users.email,
      password: users.password_hash,
      fullName: users.full_name,
      companyName: users.company_name || undefined,
      role: users.role as any,
      permissions: users.permissions as any[]
    };

    return { user, error: null };
  }

  // CRUD operations for each entity
  static async createClient(profileId: string, clientData: Omit<Client, 'id'>) {
    const { data, error } = await supabase
      .from('clients')
      .insert([{
        profile_id: profileId,
        name: clientData.name,
        email: clientData.email,
        phone: clientData.phone,
        whatsapp: clientData.whatsapp || '',
        instagram: clientData.instagram || '',
        client_type: clientData.clientType,
        status: clientData.status,
        since: clientData.since,
        last_contact: clientData.lastContact,
        portal_access_id: clientData.portalAccessId
      }])
      .select()
      .single();

    if (error) return { data: null, error };
    return { data: convertClient(data), error: null };
  }

  static async updateClient(id: string, updates: Partial<Client>) {
    const { data, error } = await supabase
      .from('clients')
      .update({
        name: updates.name,
        email: updates.email,
        phone: updates.phone,
        whatsapp: updates.whatsapp,
        instagram: updates.instagram,
        client_type: updates.clientType,
        status: updates.status,
        since: updates.since,
        last_contact: updates.lastContact,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) return { data: null, error };
    return { data: convertClient(data), error: null };
  }

  static async deleteClient(id: string) {
    const { error } = await supabase
      .from('clients')
      .delete()
      .eq('id', id);

    return { error };
  }

  static async createProject(profileId: string, projectData: Omit<Project, 'id'>) {
    const { data, error } = await supabase
      .from('projects')
      .insert([{
        profile_id: profileId,
        client_id: projectData.clientId,
        package_id: projectData.packageId || null,
        project_name: projectData.projectName,
        client_name: projectData.clientName,
        project_type: projectData.projectType,
        package_name: projectData.packageName,
        add_ons: projectData.addOns,
        date: projectData.date,
        deadline_date: projectData.deadlineDate || null,
        location: projectData.location,
        progress: projectData.progress,
        status: projectData.status,
        active_sub_statuses: projectData.activeSubStatuses || [],
        total_cost: projectData.totalCost,
        amount_paid: projectData.amountPaid,
        payment_status: projectData.paymentStatus,
        team: projectData.team,
        notes: projectData.notes || '',
        accommodation: projectData.accommodation || '',
        drive_link: projectData.driveLink || '',
        client_drive_link: projectData.clientDriveLink || '',
        final_drive_link: projectData.finalDriveLink || '',
        start_time: projectData.startTime || '',
        end_time: projectData.endTime || '',
        image: projectData.image || '',
        revisions: projectData.revisions || [],
        promo_code_id: projectData.promoCodeId || null,
        discount_amount: projectData.discountAmount || 0,
        shipping_details: projectData.shippingDetails || '',
        dp_proof_url: projectData.dpProofUrl || '',
        printing_details: projectData.printingDetails || [],
        printing_cost: projectData.printingCost || 0,
        transport_cost: projectData.transportCost || 0,
        booking_status: projectData.bookingStatus || 'Baru',
        chat_history: projectData.chatHistory || []
      }])
      .select()
      .single();

    if (error) return { data: null, error };
    return { data: convertProject(data), error: null };
  }

  static async updateProject(id: string, updates: Partial<Project>) {
    const updateData: any = {
      updated_at: new Date().toISOString()
    };

    // Map all the fields
    if (updates.projectName !== undefined) updateData.project_name = updates.projectName;
    if (updates.clientName !== undefined) updateData.client_name = updates.clientName;
    if (updates.projectType !== undefined) updateData.project_type = updates.projectType;
    if (updates.packageName !== undefined) updateData.package_name = updates.packageName;
    if (updates.addOns !== undefined) updateData.add_ons = updates.addOns;
    if (updates.date !== undefined) updateData.date = updates.date;
    if (updates.location !== undefined) updateData.location = updates.location;
    if (updates.progress !== undefined) updateData.progress = updates.progress;
    if (updates.status !== undefined) updateData.status = updates.status;
    if (updates.activeSubStatuses !== undefined) updateData.active_sub_statuses = updates.activeSubStatuses;
    if (updates.totalCost !== undefined) updateData.total_cost = updates.totalCost;
    if (updates.amountPaid !== undefined) updateData.amount_paid = updates.amountPaid;
    if (updates.paymentStatus !== undefined) updateData.payment_status = updates.paymentStatus;
    if (updates.team !== undefined) updateData.team = updates.team;
    if (updates.notes !== undefined) updateData.notes = updates.notes;
    if (updates.bookingStatus !== undefined) updateData.booking_status = updates.bookingStatus;
    if (updates.chatHistory !== undefined) updateData.chat_history = updates.chatHistory;
    if (updates.revisions !== undefined) updateData.revisions = updates.revisions;

    const { data, error } = await supabase
      .from('projects')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) return { data: null, error };
    return { data: convertProject(data), error: null };
  }

  static async deleteProject(id: string) {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id);

    return { error };
  }

  // Add similar CRUD methods for other entities...
  static async createLead(profileId: string, leadData: Omit<Lead, 'id'>) {
    const { data, error } = await supabase
      .from('leads')
      .insert([{
        profile_id: profileId,
        name: leadData.name,
        contact_channel: leadData.contactChannel,
        location: leadData.location,
        status: leadData.status,
        date: leadData.date,
        notes: leadData.notes || '',
        whatsapp: leadData.whatsapp || ''
      }])
      .select()
      .single();

    if (error) return { data: null, error };
    return { 
      data: {
        id: data.id,
        name: data.name,
        contactChannel: data.contact_channel as any,
        location: data.location,
        status: data.status as any,
        date: data.date,
        notes: data.notes,
        whatsapp: data.whatsapp
      } as Lead, 
      error: null 
    };
  }

  static async updateLead(id: string, updates: Partial<Lead>) {
    const { data, error } = await supabase
      .from('leads')
      .update({
        name: updates.name,
        contact_channel: updates.contactChannel,
        location: updates.location,
        status: updates.status,
        date: updates.date,
        notes: updates.notes,
        whatsapp: updates.whatsapp,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) return { data: null, error };
    return { 
      data: {
        id: data.id,
        name: data.name,
        contactChannel: data.contact_channel as any,
        location: data.location,
        status: data.status as any,
        date: data.date,
        notes: data.notes,
        whatsapp: data.whatsapp
      } as Lead, 
      error: null 
    };
  }

  static async deleteLead(id: string) {
    const { error } = await supabase
      .from('leads')
      .delete()
      .eq('id', id);

    return { error };
  }

  // Public form submissions (no auth required)
  static async submitPublicLead(leadData: Omit<Lead, 'id'>) {
    // Get the first profile (for demo purposes)
    const { data: profiles } = await supabase
      .from('profiles')
      .select('id')
      .limit(1)
      .single();

    if (!profiles) {
      return { data: null, error: 'No profile found' };
    }

    return this.createLead(profiles.id, leadData);
  }

  static async submitPublicFeedback(feedbackData: Omit<ClientFeedback, 'id'>) {
    // Get the first profile (for demo purposes)
    const { data: profiles } = await supabase
      .from('profiles')
      .select('id')
      .limit(1)
      .single();

    if (!profiles) {
      return { data: null, error: 'No profile found' };
    }

    const { data, error } = await supabase
      .from('client_feedback')
      .insert([{
        profile_id: profiles.id,
        client_name: feedbackData.clientName,
        satisfaction: feedbackData.satisfaction,
        rating: feedbackData.rating,
        feedback: feedbackData.feedback,
        date: feedbackData.date
      }])
      .select()
      .single();

    if (error) return { data: null, error };
    return { 
      data: {
        id: data.id,
        clientName: data.client_name,
        satisfaction: data.satisfaction as any,
        rating: data.rating,
        feedback: data.feedback,
        date: data.date
      } as ClientFeedback, 
      error: null 
    };
  }

  static async getPublicPackages() {
    const { data: profiles } = await supabase
      .from('profiles')
      .select('id')
      .limit(1)
      .single();

    if (!profiles) {
      return { data: [], error: 'No profile found' };
    }

    const { data, error } = await supabase
      .from('packages')
      .select('*')
      .eq('profile_id', profiles.id);

    if (error) return { data: [], error };
    
    return { 
      data: data.map(row => ({
        id: row.id,
        name: row.name,
        price: row.price,
        category: row.category,
        physicalItems: row.physical_items as any[],
        digitalItems: row.digital_items as string[],
        processingTime: row.processing_time,
        photographers: row.photographers,
        videographers: row.videographers,
        coverImage: row.cover_image
      } as Package)), 
      error: null 
    };
  }

  static async getPublicAddOns() {
    const { data: profiles } = await supabase
      .from('profiles')
      .select('id')
      .limit(1)
      .single();

    if (!profiles) {
      return { data: [], error: 'No profile found' };
    }

    const { data, error } = await supabase
      .from('add_ons')
      .select('*')
      .eq('profile_id', profiles.id);

    if (error) return { data: [], error };
    
    return { 
      data: data.map(row => ({
        id: row.id,
        name: row.name,
        price: row.price
      } as AddOn)), 
      error: null 
    };
  }

  static async getPublicProfile() {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .limit(1)
      .single();

    if (error) return { data: null, error };
    return { data: convertProfile(data), error: null };
  }
}