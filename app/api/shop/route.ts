import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    
    const supabase = createServerClient();

    const { data: items } = await supabase.from('shop_items').select('*');
    return NextResponse.json({ items: items || [] });
  } catch (error) {
    console.error('Shop API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    
    const supabase = createServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { item_id } = await request.json();

    // Get item details
    const { data: item } = await supabase
      .from('shop_items')
      .select('*')
      .eq('id', item_id)
      .single();

    if (!item) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    }

    // Check gems balance
    const { data: gemsData } = await supabase
      .from('gems')
      .select('balance')
      .eq('user_id', user.id)
      .single();

    if (!gemsData || gemsData.balance < item.cost_gems) {
      return NextResponse.json({ error: 'Insufficient gems' }, { status: 400 });
    }

    // Deduct gems and add to inventory
    await supabase
      .from('gems')
      .update({ balance: gemsData.balance - item.cost_gems })
      .eq('user_id', user.id);

    const { data: inventoryItem } = await supabase
      .from('user_inventory')
      .insert({ user_id: user.id, item_id })
      .select()
      .single();

    // Apply item effects
    if (item.type === 'heart_refill') {
      await supabase
        .from('hearts')
        .update({ current_hearts: 5 })
        .eq('user_id', user.id);
    } else if (item.type === 'streak_freeze') {
      await supabase
        .from('streaks')
        .update({ streak_freeze_count: ((gemsData as Record<string, number>).streak_freeze_count || 0) + 1 })
        .eq('user_id', user.id);
    }

    return NextResponse.json({ success: true, item: inventoryItem });
  } catch (error) {
    console.error('Shop purchase error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
